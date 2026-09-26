"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { Segmented } from "@tsumi/ui/components/controls";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { EmptyState, ErrorState, LoadingList } from "@tsumi/ui/components/states";
import { qs } from "@tsumi/ui/lib/api";
import type { Errand, Page } from "@tsumi/ui/lib/types";

import { JobCard } from "@/components/job-card";
import { api } from "@/lib/client";
import { ACTIVE_STATUSES, PAST_STATUSES } from "@/lib/jobs";

export default function ActiveJobsPage() {
  const [tab, setTab] = useState<"active" | "past">("active");
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["jobs", "mine", tab, page],
    queryFn: () =>
      api<Page<Errand>>(`/errands/${qs({ scope: "mine", status: tab === "active" ? ACTIVE_STATUSES : PAST_STATUSES, page })}`),
    refetchInterval: tab === "active" ? 20_000 : false,
  });

  return (
    <>
      <AppHeader large title="My jobs" />
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
          <EmptyState
            title={tab === "active" ? "No active jobs" : "No past jobs yet"}
            hint={tab === "active" ? "Accept an open job to get started." : undefined}
          />
        )}
        <div className="space-y-3">
          {data?.results.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block">
              <JobCard job={job} showStatus />
            </Link>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          {page > 1 ? <button type="button" onClick={() => setPage(page - 1)}>Newer</button> : <span />}
          {data?.next && <button type="button" onClick={() => setPage(page + 1)}>Older</button>}
        </div>
      </div>
    </>
  );
}
