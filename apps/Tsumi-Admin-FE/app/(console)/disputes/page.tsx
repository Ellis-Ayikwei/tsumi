"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { Pager } from "@/components/pager";
import { EmptyState, ErrorState, LoadingRows } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { api, qs } from "@/lib/api";
import { formatDateTime, fullName, humanize } from "@/lib/format";
import { formatGhs } from "@/lib/money";
import type { AdminDispute, Page } from "@/lib/types";

export default function DisputesPage() {
  const client = useQueryClient();
  const [status, setStatus] = useState("open");
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["disputes", status, page],
    queryFn: () => api<Page<AdminDispute>>(`/admin/disputes/${qs({ status, page })}`),
  });

  const resolve = async (dispute: AdminDispute, resolution: "refund_customer" | "release_agent", note: string) => {
    await api(`/admin/disputes/${dispute.id}/resolve/`, { method: "POST", body: { resolution, note } });
    client.invalidateQueries({ queryKey: ["disputes"] });
    client.invalidateQueries({ queryKey: ["stats"] });
    toast.success(resolution === "refund_customer" ? "Customer refunded." : "Agent paid.");
  };

  return (
    <>
      <PageHeader
        title="Disputes"
        description="Oldest open disputes first. Each resolution moves escrow money once and cannot be reversed."
        actions={
          <NativeSelect aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="">All</option>
          </NativeSelect>
        }
      />
      {isLoading && <LoadingRows />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.results.length === 0 && <EmptyState title={status === "open" ? "No open disputes" : "Nothing here"} />}
      <div className="space-y-4">
        {data?.results.map((dispute) => {
          const { errand } = dispute;
          return (
            <Card key={dispute.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-base">
                    <Link href={`/errands/${errand.id}`} className="hover:underline">{errand.title}</Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {humanize(dispute.reason)} · opened by {fullName(dispute.opened_by)} ({dispute.opened_by.user_type}) ·{" "}
                    {formatDateTime(dispute.created_at)}
                  </p>
                </div>
                <StatusBadge status={dispute.status} />
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="whitespace-pre-wrap">{dispute.description}</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div><span className="text-muted-foreground">Customer: </span>{fullName(errand.customer)} {errand.customer.phone_number}</div>
                  <div><span className="text-muted-foreground">Agent: </span>{errand.agent ? `${fullName(errand.agent)} ${errand.agent.phone_number ?? ""}` : "-"}</div>
                  <div><span className="text-muted-foreground">In escrow: </span>{formatGhs(errand.price_pesewas)}</div>
                </div>
                {dispute.status === "open" ? (
                  <div className="flex flex-wrap gap-2">
                    <ConfirmDialog
                      trigger={<Button variant="outline">Refund customer</Button>}
                      title="Refund the customer?"
                      description={`${formatGhs(errand.price_pesewas)} returns to ${fullName(errand.customer)}'s wallet. The agent is paid nothing.`}
                      confirmLabel="Refund customer"
                      field={{ label: "Note to both parties", multiline: true }}
                      onConfirm={(note) => resolve(dispute, "refund_customer", note)}
                    />
                    <ConfirmDialog
                      trigger={<Button>Pay agent</Button>}
                      title="Pay the agent?"
                      description={`${formatGhs(errand.agent_payout_pesewas)} goes to the agent and ${formatGhs(errand.commission_pesewas)} to Tsumi.`}
                      confirmLabel="Pay agent"
                      field={{ label: "Note to both parties", multiline: true }}
                      onConfirm={(note) => resolve(dispute, "release_agent", note)}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {humanize(dispute.resolution)} on {formatDateTime(dispute.resolved_at)}
                    {dispute.resolution_note && `: ${dispute.resolution_note}`}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Pager page={page} data={data} onPage={setPage} />
    </>
  );
}
