"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingRows } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { formatGhs } from "@/lib/money";
import type { AdminStats, ErrandStatus } from "@/lib/types";

const STATUS_ORDER: ErrandStatus[] = [
  "open",
  "accepted",
  "in_progress",
  "delivered",
  "disputed",
  "completed",
  "cancelled",
  "refunded",
];

function Tile({ label, value, hint, href }: { label: string; value: string; hint?: string; href?: string }) {
  const body = (
    <Card className={href ? "transition-colors hover:bg-accent/40" : undefined}>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint && <CardContent className="text-xs text-muted-foreground">{hint}</CardContent>}
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default function OverviewPage() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api<AdminStats>("/admin/stats/"),
  });

  return (
    <>
      <PageHeader title="Overview" description="Queues that need a person, then money and volume." />
      {isLoading && <LoadingRows rows={6} />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Needs attention</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Tile label="Runners waiting for KYC" value={String(data.agents_pending_kyc)} href="/agents" />
              <Tile label="Open disputes" value={String(data.open_disputes)} href="/disputes" />
              <Tile
                label="Withdrawals to pay"
                value={String(data.pending_withdrawals.count)}
                hint={`${formatGhs(data.pending_withdrawals.total_pesewas)} requested`}
                href="/withdrawals"
              />
              <Tile
                label="Delivered, awaiting confirmation"
                value={String(data.errands_by_status.delivered ?? 0)}
                href="/errands?status=delivered"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">Money</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Tile label="Held in escrow" value={formatGhs(data.escrow_held_pesewas)} href="/ledger?wallet_kind=escrow" />
              <Tile label="Platform balance" value={formatGhs(data.platform_balance_pesewas)} href="/ledger?wallet_kind=platform" />
              <Tile label="GMV, last 30 days" value={formatGhs(data.last_30_days.gmv_pesewas)} hint={`${data.last_30_days.completed_errands} completed errands`} />
              <Tile label="Commission, last 30 days" value={formatGhs(data.last_30_days.commission_pesewas)} />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Errands by status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {STATUS_ORDER.map((status) => (
                  <Link
                    key={status}
                    href={`/errands?status=${status}`}
                    className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-accent"
                  >
                    <StatusBadge status={status} />
                    <span className="tabular-nums">{(data.errands_by_status[status] ?? 0).toLocaleString()}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">People</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  ["Customers", data.users.customers, "/users?user_type=customer"],
                  ["Runners", data.users.agents, "/users?user_type=agent"],
                  ["Suspended", data.users.suspended, "/users?is_active=false"],
                  ["Joined in the last 30 days", data.users.new_last_30d, "/users"],
                ].map(([label, value, href]) => (
                  <Link key={label} href={String(href)} className="flex justify-between rounded-md px-2 py-1 hover:bg-accent">
                    <span>{label}</span>
                    <span className="tabular-nums">{Number(value).toLocaleString()}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      )}
    </>
  );
}
