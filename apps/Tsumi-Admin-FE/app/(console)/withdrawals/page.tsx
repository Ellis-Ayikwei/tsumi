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
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, qs } from "@/lib/api";
import { formatDateTime, fullName, humanize } from "@/lib/format";
import { formatGhs } from "@/lib/money";
import type { AdminWithdrawal, Page } from "@/lib/types";

export default function WithdrawalsPage() {
  const client = useQueryClient();
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["withdrawals", status, page],
    queryFn: () => api<Page<AdminWithdrawal>>(`/admin/withdrawals/${qs({ status, page })}`),
  });

  const settle = async (w: AdminWithdrawal, action: "approve" | "reject", body: Record<string, string>) => {
    await api(`/admin/withdrawals/${w.id}/${action}/`, { method: "POST", body });
    client.invalidateQueries({ queryKey: ["withdrawals"] });
    client.invalidateQueries({ queryKey: ["stats"] });
    toast.success(action === "approve" ? "Marked as paid." : "Rejected. Money returned to the wallet.");
  };

  return (
    <>
      <PageHeader
        title="Withdrawals"
        description="Send the MoMo payment first, then mark it paid with the MoMo transaction ID."
        actions={
          <NativeSelect aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </NativeSelect>
        }
      />
      {isLoading && <LoadingRows />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.results.length === 0 && <EmptyState title={status === "pending" ? "Nothing to pay out" : "Nothing here"} />}
      {data && data.results.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requested</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Pay to</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="whitespace-nowrap">{formatDateTime(w.created_at)}</TableCell>
                <TableCell>
                  <Link href={`/users/${w.user.id}`} className="hover:underline">{fullName(w.user)}</Link>
                  <div className="text-xs text-muted-foreground">{w.user.email}</div>
                </TableCell>
                <TableCell>
                  <div className="font-mono">{w.momo_number}</div>
                  <div className="text-xs text-muted-foreground">{humanize(w.network)}</div>
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">{formatGhs(w.amount_pesewas)}</TableCell>
                <TableCell>
                  <StatusBadge status={w.status} />
                  {w.payout_reference && <div className="text-xs text-muted-foreground">{w.payout_reference}</div>}
                  {w.rejection_reason && <div className="text-xs text-muted-foreground">{w.rejection_reason}</div>}
                </TableCell>
                <TableCell className="text-right">
                  {w.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <ConfirmDialog
                        trigger={<Button size="sm">Mark paid</Button>}
                        title={`Mark ${formatGhs(w.amount_pesewas)} as paid?`}
                        description={`Only do this after sending the money to ${w.momo_number} (${humanize(w.network)}).`}
                        confirmLabel="Mark paid"
                        field={{ label: "MoMo transaction ID", placeholder: "e.g. 12345678901", required: true }}
                        onConfirm={(payout_reference) => settle(w, "approve", { payout_reference })}
                      />
                      <ConfirmDialog
                        trigger={<Button size="sm" variant="outline">Reject</Button>}
                        title="Reject this withdrawal?"
                        description="The amount goes back to the user's Tsumi wallet."
                        confirmLabel="Reject"
                        confirmVariant="destructive"
                        field={{ label: "Reason (shown to the user)", required: true, placeholder: "MoMo name does not match the account" }}
                        onConfirm={(reason) => settle(w, "reject", { reason })}
                      />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Pager page={page} data={data} onPage={setPage} />
    </>
  );
}
