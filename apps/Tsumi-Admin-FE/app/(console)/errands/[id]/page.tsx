"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { use } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingRows } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { formatDateTime, fullName, humanize } from "@/lib/format";
import { formatGhs } from "@/lib/money";
import type { AdminErrandDetail } from "@/lib/types";

const CANCELLABLE = ["open", "accepted", "in_progress"];

export default function ErrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = useQueryClient();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["errand", id],
    queryFn: () => api<AdminErrandDetail>(`/admin/errands/${id}/`),
  });

  if (isLoading) return <LoadingRows />;
  if (error || !data) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <>
      <PageHeader
        title={data.title}
        description={`${humanize(data.errand_type)} · created ${formatDateTime(data.created_at)}`}
        actions={
          <>
            <StatusBadge status={data.status} />
            {data.dispute_id && (
              <Button asChild variant="outline" size="sm">
                <Link href="/disputes">View dispute</Link>
              </Button>
            )}
            {CANCELLABLE.includes(data.status) && (
              <ConfirmDialog
                trigger={<Button variant="destructive" size="sm">Cancel and refund</Button>}
                title="Cancel this errand?"
                description={`${formatGhs(data.price_pesewas)} goes back to the customer's wallet. The customer and runner are notified. This cannot be undone.`}
                confirmLabel="Cancel and refund"
                confirmVariant="destructive"
                field={{ label: "Reason (shown to both parties)", required: true, multiline: true }}
                onConfirm={async (reason) => {
                  const updated = await api<AdminErrandDetail>(`/admin/errands/${id}/cancel/`, {
                    method: "POST",
                    body: { reason },
                  });
                  client.setQueryData(["errand", id], updated);
                  client.invalidateQueries({ queryKey: ["stats"] });
                  toast.success("Errand cancelled and refunded.");
                }}
              />
            )}
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Money</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Price</span><span className="tabular-nums">{formatGhs(data.price_pesewas)}</span></div>
            <div className="flex justify-between"><span>Runner payout</span><span className="tabular-nums">{formatGhs(data.agent_payout_pesewas)}</span></div>
            <div className="flex justify-between">
              <span>Commission ({data.commission_bps / 100}%)</span>
              <span className="tabular-nums">{formatGhs(data.commission_pesewas)}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span>Escrow</span>
              {data.escrow ? <StatusBadge status={data.escrow.status} /> : <span>-</span>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">People</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground">Customer</div>
              <Link href={`/users/${data.customer.id}`} className="hover:underline">{fullName(data.customer)}</Link>
              <div className="text-muted-foreground">{data.customer.phone_number ?? data.customer.email}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Runner</div>
              {data.agent ? (
                <>
                  <Link href={`/users/${data.agent.id}`} className="hover:underline">{fullName(data.agent)}</Link>
                  <div className="text-muted-foreground">{data.agent.phone_number ?? data.agent.email}</div>
                </>
              ) : (
                <span>Not assigned</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Where</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><div className="text-muted-foreground">Pickup</div>{data.pickup_address || "-"}</div>
            <div><div className="text-muted-foreground">Drop-off</div>{data.dropoff_address || "-"}</div>
            {data.description && <div><div className="text-muted-foreground">Notes</div>{data.description}</div>}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            {data.events.map((event, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2">
                <span className="w-44 shrink-0 text-muted-foreground">{formatDateTime(event.created_at)}</span>
                <StatusBadge status={event.to_status} />
                <span className="text-muted-foreground">{event.actor_email ?? "system"}</span>
                {event.note && <span>&quot;{event.note}&quot;</span>}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Ledger lines</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.ledger.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="whitespace-nowrap">{formatDateTime(line.created_at)}</TableCell>
                  <TableCell>{humanize(line.entry_type)}</TableCell>
                  <TableCell>{line.wallet_owner_email ?? humanize(line.wallet_kind)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatGhs(line.amount_pesewas)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
