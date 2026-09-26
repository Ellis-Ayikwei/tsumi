"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@tsumi/ui/components/button";
import { AmountInput, ChoiceChips } from "@tsumi/ui/components/controls";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@tsumi/ui/components/drawer";
import { Input } from "@tsumi/ui/components/input";
import { Label } from "@tsumi/ui/components/label";
import { LedgerRow } from "@tsumi/ui/components/ledger-row";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { useSession } from "@tsumi/ui/components/session-gate";
import { EmptyState, ErrorState, LoadingList } from "@tsumi/ui/components/states";
import { StatusBadge } from "@tsumi/ui/components/status-badge";
import { ApiError } from "@tsumi/ui/lib/api";
import { formatDateTime, humanize } from "@tsumi/ui/lib/format";
import { formatGhs, parseGhsToPesewas } from "@tsumi/ui/lib/money";
import type { LedgerEntry, Page, WalletSummary, Withdrawal } from "@tsumi/ui/lib/types";

import { api } from "@/lib/client";

const MIN_WITHDRAWAL_PESEWAS = 1000;
const NETWORKS = [
  { value: "mtn", label: "MTN MoMo" },
  { value: "telecel", label: "Telecel Cash" },
  { value: "airteltigo", label: "AirtelTigo" },
] as const;

function WithdrawSheet({ balancePesewas }: { balancePesewas: number }) {
  const user = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState<Withdrawal["network"]>("mtn");
  const [momo, setMomo] = useState(user.phone_number ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pesewas = parseGhsToPesewas(amount);
  const tooMuch = pesewas !== null && pesewas > balancePesewas;
  const tooLittle = pesewas !== null && pesewas > 0 && pesewas < MIN_WITHDRAWAL_PESEWAS;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await api("/wallet/withdrawals/", {
        method: "POST",
        body: { amount_pesewas: pesewas, network, momo_number: momo },
      });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
      toast.success("Withdrawal requested. Tsumi pays out to your MoMo shortly.");
      setOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not request the withdrawal. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        // Default to withdrawing everything: the usual choice.
        if (next) setAmount(balancePesewas ? String(balancePesewas / 100) : "");
      }}
    >
      <DrawerTrigger asChild>
        <Button size="sm" className="rounded-full bg-white text-zinc-900 hover:bg-white/90" disabled={balancePesewas < MIN_WITHDRAWAL_PESEWAS}>
          <ArrowUpRight /> Withdraw
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Withdraw to MoMo</DrawerTitle>
          <DrawerDescription>Available {formatGhs(balancePesewas)}</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 px-5 py-2">
          <AmountInput id="withdraw-amount" value={amount} onChange={setAmount} />
          {tooMuch && <p className="text-sm text-destructive">That&apos;s more than your balance of {formatGhs(balancePesewas)}.</p>}
          {tooLittle && <p className="text-sm text-destructive">The minimum withdrawal is {formatGhs(MIN_WITHDRAWAL_PESEWAS)}.</p>}
          <ChoiceChips label="Network" value={network} onChange={setNetwork} options={[...NETWORKS]} />
          <div className="grid gap-1.5">
            <Label htmlFor="momo">MoMo number</Label>
            <Input id="momo" type="tel" className="h-12 rounded-xl" placeholder="024 123 4567" value={momo} onChange={(e) => setMomo(e.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
        <DrawerFooter>
          <Button size="xl" onClick={submit} disabled={busy || !pesewas || tooMuch || tooLittle || !momo.trim()}>
            {busy ? "Requesting..." : pesewas ? `Withdraw ${formatGhs(pesewas)}` : "Enter an amount"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function EarningsPage() {
  const [page, setPage] = useState(1);
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: () => api<WalletSummary>("/wallet/") });
  const withdrawals = useQuery({
    queryKey: ["withdrawals"],
    queryFn: () => api<Page<Withdrawal>>("/wallet/withdrawals/?page_size=5"),
  });
  const ledger = useQuery({
    queryKey: ["ledger", page],
    queryFn: () => api<Page<LedgerEntry>>(`/wallet/ledger/?page=${page}`),
  });
  const balance = wallet.data?.balance_pesewas ?? 0;

  return (
    <>
      <AppHeader large title="Earnings" />
      <div className="space-y-5 px-4">
        <section className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-emerald-900 p-5 text-white shadow-lg">
          <p className="text-sm text-white/70">Available to withdraw</p>
          <p className="mt-1 text-4xl font-bold tabular-nums">{wallet.data ? formatGhs(balance) : "..."}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-white/70">
              {wallet.data?.pending_withdrawals_pesewas
                ? `${formatGhs(wallet.data.pending_withdrawals_pesewas)} on its way to MoMo`
                : "Payouts land here when customers confirm"}
            </p>
            <WithdrawSheet balancePesewas={balance} />
          </div>
        </section>

        {!!withdrawals.data?.results.length && (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Withdrawals</h2>
            <div className="divide-y rounded-3xl border bg-card px-4 shadow-sm">
              {withdrawals.data.results.map((w) => (
                <div key={w.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium tabular-nums">{formatGhs(w.amount_pesewas)}</p>
                    <p className="text-xs text-muted-foreground">
                      {humanize(w.network)} {w.momo_number} · {formatDateTime(w.created_at)}
                    </p>
                    {w.rejection_reason && <p className="text-xs text-destructive">{w.rejection_reason}</p>}
                  </div>
                  <StatusBadge status={w.status} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-1 text-lg font-semibold">Activity</h2>
          {ledger.isLoading && <LoadingList />}
          {ledger.error && <ErrorState error={ledger.error} onRetry={() => ledger.refetch()} />}
          {ledger.data?.results.length === 0 && <EmptyState title="No earnings yet" hint="Finish a job and your payout shows up here." />}
          <div className="divide-y">
            {ledger.data?.results.map((entry) => <LedgerRow key={entry.id} entry={entry} errandHref="/jobs" />)}
          </div>
          <div className="flex justify-between py-2 text-sm text-muted-foreground">
            {page > 1 ? <button type="button" onClick={() => setPage(page - 1)}>Newer</button> : <span />}
            {ledger.data?.next && <button type="button" onClick={() => setPage(page + 1)}>Older</button>}
          </div>
        </section>
      </div>
    </>
  );
}
