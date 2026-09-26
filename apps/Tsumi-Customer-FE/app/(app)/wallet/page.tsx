"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@tsumi/ui/components/button";
import { LedgerRow } from "@tsumi/ui/components/ledger-row";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { EmptyState, ErrorState, LoadingList } from "@tsumi/ui/components/states";
import { formatGhs } from "@tsumi/ui/lib/money";
import type { LedgerEntry, Page, WalletSummary } from "@tsumi/ui/lib/types";

import { TopUpSheet } from "@/components/topup-sheet";
import { api } from "@/lib/client";

export default function WalletPage() {
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [page, setPage] = useState(1);
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: () => api<WalletSummary>("/wallet/") });
  const ledger = useQuery({
    queryKey: ["ledger", page],
    queryFn: () => api<Page<LedgerEntry>>(`/wallet/ledger/?page=${page}`),
  });

  return (
    <>
      <AppHeader large title="Wallet" />
      <div className="space-y-5 px-4">
        <section className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-emerald-900 p-5 text-white shadow-lg">
          <p className="text-sm text-white/70">Available</p>
          <p className="mt-1 text-4xl font-bold tabular-nums">{wallet.data ? formatGhs(wallet.data.balance_pesewas) : "..."}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="flex items-center gap-1 text-xs text-white/70">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {formatGhs(wallet.data?.held_in_escrow_pesewas ?? 0)} in TsumiSafe
            </p>
            <Button size="sm" className="rounded-full bg-white text-zinc-900 hover:bg-white/90" onClick={() => setTopUpOpen(true)}>
              <Plus /> Top up
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-lg font-semibold">Activity</h2>
          {ledger.isLoading && <LoadingList />}
          {ledger.error && <ErrorState error={ledger.error} onRetry={() => ledger.refetch()} />}
          {ledger.data?.results.length === 0 && <EmptyState title="No activity yet" hint="Top ups, errand payments and refunds show here." />}
          <div className="divide-y">
            {ledger.data?.results.map((entry) => <LedgerRow key={entry.id} entry={entry} errandHref="/errands" />)}
          </div>
          <div className="flex justify-between py-2 text-sm text-muted-foreground">
            {page > 1 ? <button type="button" onClick={() => setPage(page - 1)}>Newer</button> : <span />}
            {ledger.data?.next && <button type="button" onClick={() => setPage(page + 1)}>Older</button>}
          </div>
        </section>
      </div>
      <TopUpSheet open={topUpOpen} onOpenChange={setTopUpOpen} />
    </>
  );
}
