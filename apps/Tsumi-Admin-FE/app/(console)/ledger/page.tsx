"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { Pager } from "@/components/pager";
import { EmptyState, ErrorState, LoadingRows } from "@/components/states";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, qs } from "@/lib/api";
import { formatDateTime, humanize } from "@/lib/format";
import { formatGhs } from "@/lib/money";
import type { LedgerEntry, Page } from "@/lib/types";

const ENTRY_TYPES = [
  "deposit",
  "escrow_hold",
  "escrow_release",
  "commission",
  "escrow_refund",
  "withdrawal_hold",
  "withdrawal_reversal",
  "payout",
  "adjustment",
];

function LedgerList() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const walletKind = params.get("wallet_kind") ?? "";
  const entryType = params.get("entry_type") ?? "";
  const user = params.get("user") ?? "";
  const page = Number(params.get("page") ?? 1);

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
    queryKey: ["ledger", walletKind, entryType, user, page],
    queryFn: () =>
      api<Page<LedgerEntry>>(`/admin/ledger/${qs({ wallet_kind: walletKind, entry_type: entryType, user, page })}`),
  });

  return (
    <>
      <PageHeader
        title="Ledger"
        description="Every balance change, newest first. Lines sharing a transfer ID are the two sides of one transfer."
        actions={
          <>
            <NativeSelect aria-label="Wallet" value={walletKind} onChange={(e) => setParam({ wallet_kind: e.target.value })}>
              <option value="">All wallets</option>
              <option value="user">User wallets</option>
              <option value="escrow">Escrow</option>
              <option value="platform">Platform</option>
              <option value="payout_clearing">Payout clearing</option>
            </NativeSelect>
            <NativeSelect aria-label="Entry type" value={entryType} onChange={(e) => setParam({ entry_type: e.target.value })}>
              <option value="">All types</option>
              {ENTRY_TYPES.map((t) => (
                <option key={t} value={t}>{humanize(t)}</option>
              ))}
            </NativeSelect>
          </>
        }
      />
      {isLoading && <LoadingRows />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.results.length === 0 && <EmptyState title="No ledger lines match" />}
      {data && data.results.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Memo / errand</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Balance after</TableHead>
              <TableHead>Transfer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((line) => (
              <TableRow key={line.id}>
                <TableCell className="whitespace-nowrap">{formatDateTime(line.created_at)}</TableCell>
                <TableCell>{humanize(line.entry_type)}</TableCell>
                <TableCell>{line.wallet_owner_email ?? humanize(line.wallet_kind)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {line.errand ? <Link href={`/errands/${line.errand}`} className="underline">errand</Link> : line.memo}
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatGhs(line.amount_pesewas)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatGhs(line.balance_after_pesewas)}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{line.transfer_id.slice(0, 8)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Pager page={page} data={data} onPage={(p) => setParam({ page: String(p) })} />
    </>
  );
}

export default function LedgerPage() {
  return (
    <Suspense fallback={<LoadingRows />}>
      <LedgerList />
    </Suspense>
  );
}
