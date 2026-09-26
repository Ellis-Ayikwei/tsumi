"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Segmented } from "@tsumi/ui/components/controls";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { EmptyState, ErrorState, LoadingList } from "@tsumi/ui/components/states";
import { qs } from "@tsumi/ui/lib/api";
import type { Errand, Page } from "@tsumi/ui/lib/types";

import { ErrandCard } from "@/components/errand-card";
import { api } from "@/lib/client";

const FILTERS = {
  active: "open,accepted,in_progress,delivered,disputed",
  past: "completed,cancelled,refunded",
} as const;

export default function ErrandsPage() {
  const [tab, setTab] = useState<keyof typeof FILTERS>("active");
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["errands", tab, page],
    queryFn: () => api<Page<Errand>>(`/errands/${qs({ status: FILTERS[tab], page })}`),
    refetchInterval: tab === "active" ? 20_000 : false,
  });

  return (
    <>
      <AppHeader large title="Errands" />
      <div className="space-y-4 px-4">
        <Segmented
          value={tab}
          onChange={(next) => {
            setTab(next);
            setPage(1);
          }}
          options={[
            { value: "active", label: "Active" },
            { value: "past", label: "Past" },
          ]}
        />
        {isLoading && <LoadingList />}
        {error && <ErrorState error={error} onRetry={() => refetch()} />}
        {data?.results.length === 0 && (
          <EmptyState title={tab === "active" ? "Nothing in progress" : "No past errands yet"} />
        )}
        <div className="space-y-3">
          {data?.results.map((errand) => <ErrandCard key={errand.id} errand={errand} />)}
        </div>
        {data?.next && (
          <button
            type="button"
            disabled={isFetching}
            onClick={() => setPage(page + 1)}
            className="w-full rounded-2xl py-3 text-sm text-muted-foreground"
          >
            Older errands
          </button>
        )}
        {page > 1 && (
          <button type="button" onClick={() => setPage(page - 1)} className="w-full py-2 text-sm text-muted-foreground">
            Newer errands
          </button>
        )}
      </div>
    </>
  );
}
