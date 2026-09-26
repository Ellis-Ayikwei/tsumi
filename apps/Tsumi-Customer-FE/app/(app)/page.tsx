"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@tsumi/ui/components/button";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { useSession } from "@tsumi/ui/components/session-gate";
import { EmptyState, ErrorState, LoadingList } from "@tsumi/ui/components/states";
import { formatGhs } from "@tsumi/ui/lib/money";
import type { Errand, ErrandType, NotificationPage, Page, WalletSummary } from "@tsumi/ui/lib/types";

import { ErrandCard } from "@/components/errand-card";
import { ERRAND_TYPES } from "@/components/errand-meta";
import { NewErrandSheet } from "@/components/new-errand-sheet";
import { TopUpSheet } from "@/components/topup-sheet";
import { api } from "@/lib/client";
import { drafts } from "@/lib/draft";

const ACTIVE = "open,accepted,in_progress,delivered,disputed";

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", timeZone: "Africa/Accra" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default function HomePage() {
  const user = useSession();
  const [sheetType, setSheetType] = useState<ErrandType | undefined>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);

  const wallet = useQuery({ queryKey: ["wallet"], queryFn: () => api<WalletSummary>("/wallet/") });
  const active = useQuery({
    queryKey: ["errands", "active"],
    queryFn: () => api<Page<Errand>>(`/errands/?status=${ACTIVE}`),
    refetchInterval: 20_000,
  });
  const unread = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => api<NotificationPage>("/notifications/?unread=1&page_size=1"),
    refetchInterval: 30_000,
  });

  // Back from a top-up that interrupted an errand: reopen the saved draft.
  useEffect(() => {
    if (drafts.takeResume() && drafts.load()) setSheetOpen(true);
  }, []);

  const openSheet = (type?: ErrandType) => {
    setSheetType(type);
    setSheetOpen(true);
  };

  return (
    <>
      <AppHeader
        large
        title={`${greeting()}, ${user.first_name}`}
        subtitle="What can we run for you today?"
        actions={
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border"
          >
            <Bell className="h-5 w-5" />
            {!!unread.data?.unread_count && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
            )}
          </Link>
        }
      />

      <div className="space-y-6 px-4">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-emerald-900 p-5 text-white shadow-lg">
          <p className="text-sm text-white/70">Wallet balance</p>
          <p className="mt-1 text-4xl font-bold tabular-nums">
            {wallet.data ? formatGhs(wallet.data.balance_pesewas) : "..."}
          </p>
          {!!wallet.data?.held_in_escrow_pesewas && (
            <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {formatGhs(wallet.data.held_in_escrow_pesewas)} held safely for your errands
            </p>
          )}
          <Button
            size="sm"
            className="mt-4 rounded-full bg-white text-zinc-900 hover:bg-white/90"
            onClick={() => setTopUpOpen(true)}
          >
            <Plus /> Top up
          </Button>
        </section>

        <section>
          <div className="grid grid-cols-2 gap-3">
            {ERRAND_TYPES.map(({ value, label, hint, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => openSheet(value)}
                className="flex flex-col items-start gap-3 rounded-3xl border bg-card p-4 text-left shadow-sm transition-transform active:scale-[0.97]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-xs text-muted-foreground">{hint}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Happening now</h2>
            <Link href="/errands" className="text-sm text-muted-foreground">
              See all
            </Link>
          </div>
          {active.isLoading && <LoadingList rows={2} />}
          {active.error && <ErrorState error={active.error} onRetry={() => active.refetch()} />}
          {active.data?.results.length === 0 && (
            <EmptyState
              title="No errands in progress"
              hint="Post one and a verified runner picks it up."
              action={
                <Button className="rounded-full" onClick={() => openSheet()}>
                  <Plus /> New errand
                </Button>
              }
            />
          )}
          {active.data?.results.map((errand) => <ErrandCard key={errand.id} errand={errand} />)}
        </section>
      </div>

      <button
        type="button"
        onClick={() => openSheet()}
        aria-label="New errand"
        className="fixed bottom-28 right-[max(1rem,calc(50%-14rem+1rem))] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform active:scale-90"
      >
        <Plus className="h-6 w-6" />
      </button>

      <NewErrandSheet open={sheetOpen} onOpenChange={setSheetOpen} initialType={sheetType} />
      <TopUpSheet open={topUpOpen} onOpenChange={setTopUpOpen} />
    </>
  );
}
