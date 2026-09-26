"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { Pager } from "@/components/pager";
import { EmptyState, ErrorState, LoadingRows } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, qs } from "@/lib/api";
import { formatDateTime, fullName } from "@/lib/format";
import { formatGhs } from "@/lib/money";
import type { AdminErrand, Page } from "@/lib/types";

const STATUSES = ["open", "accepted", "in_progress", "delivered", "disputed", "completed", "cancelled", "refunded"];

function ErrandsList() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const status = params.get("status") ?? "";
  const q = params.get("q") ?? "";
  const user = params.get("user") ?? "";
  const page = Number(params.get("page") ?? 1);
  const [search, setSearch] = useState(q);

  // Filters live in the URL so a filtered view can be shared or bookmarked.
  const setParam = (next: Record<string, string>) => {
    const merged = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) merged.set(k, v);
      else merged.delete(k);
    }
    if (!("page" in next)) merged.delete("page");
    router.replace(`${pathname}?${merged.toString()}`);
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["errands", status, q, user, page],
    queryFn: () => api<Page<AdminErrand>>(`/admin/errands/${qs({ status, q, user, page })}`),
  });

  return (
    <>
      <PageHeader
        title="Errands"
        actions={
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setParam({ q: search.trim() });
              }}
            >
              <Input
                aria-label="Search errands"
                placeholder="Title or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56"
              />
            </form>
            <NativeSelect aria-label="Status" value={status} onChange={(e) => setParam({ status: e.target.value })}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </NativeSelect>
          </>
        }
      />
      {isLoading && <LoadingRows />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.results.length === 0 && <EmptyState title="No errands match" hint="Clear the filters to see everything." />}
      {data && data.results.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Errand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Runner</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((errand) => (
              <TableRow key={errand.id} className="cursor-pointer" onClick={() => router.push(`/errands/${errand.id}`)}>
                <TableCell>
                  <Link href={`/errands/${errand.id}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                    {errand.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">{errand.dropoff_address || errand.pickup_address}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={errand.status} />
                </TableCell>
                <TableCell>{fullName(errand.customer)}</TableCell>
                <TableCell>{errand.agent ? fullName(errand.agent) : "-"}</TableCell>
                <TableCell className="text-right tabular-nums">{formatGhs(errand.price_pesewas)}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(errand.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Pager page={page} data={data} onPage={(p) => setParam({ page: String(p) })} />
    </>
  );
}

export default function ErrandsPage() {
  return (
    <Suspense fallback={<LoadingRows />}>
      <ErrandsList />
    </Suspense>
  );
}
