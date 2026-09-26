"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Check, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { use, useState } from "react";
import { toast } from "sonner";

import { ActionSheet } from "@tsumi/ui/components/action-sheet";
import { Button } from "@tsumi/ui/components/button";
import { StarRating } from "@tsumi/ui/components/controls";
import { DisputeSheet } from "@tsumi/ui/components/dispute-sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@tsumi/ui/components/drawer";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { RouteMap } from "@tsumi/ui/components/route-map";
import { ErrorState, LoadingList } from "@tsumi/ui/components/states";
import { StatusBadge } from "@tsumi/ui/components/status-badge";
import { Textarea } from "@tsumi/ui/components/textarea";
import { ApiError } from "@tsumi/ui/lib/api";
import { formatDateTime } from "@tsumi/ui/lib/format";
import { parseCoords } from "@tsumi/ui/lib/maps";
import { formatGhs } from "@tsumi/ui/lib/money";
import type { Errand, ErrandStatus, UserBadge } from "@tsumi/ui/lib/types";
import { cn } from "@tsumi/ui/lib/utils";

import { ErrandTypeIcon } from "@/components/errand-meta";
import { api, client } from "@/lib/client";

const PROGRESS: { status: ErrandStatus; label: string }[] = [
  { status: "open", label: "Posted" },
  { status: "accepted", label: "Agent assigned" },
  { status: "in_progress", label: "On the way" },
  { status: "delivered", label: "Done, confirm" },
  { status: "completed", label: "Paid" },
];

const LIVE: ErrandStatus[] = ["open", "accepted", "in_progress", "delivered", "disputed"];

function RateSheet({ errand, onDone }: { errand: Errand; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await api(`/errands/${errand.id}/rate/`, { method: "POST", body: { stars, comment: comment.trim() } });
      toast.success("Thanks for rating!");
      setOpen(false);
      onDone();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save your rating.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="xl" className="w-full">
          <Star /> Rate {errand.agent?.display_name ?? "your agent"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle>How was {errand.agent?.display_name ?? "your agent"}?</DrawerTitle>
          <DrawerDescription>Ratings help great agents earn trust badges.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 px-5 py-2">
          <StarRating value={stars} onChange={setStars} />
          <Textarea
            aria-label="Comment"
            className="rounded-xl"
            placeholder="Anything to add? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DrawerFooter>
          <Button size="xl" disabled={!stars || busy} onClick={submit}>
            {busy ? "Saving..." : "Submit rating"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function ErrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { data: errand, error, isLoading, refetch } = useQuery({
    queryKey: ["errand", id],
    queryFn: () => api<Errand>(`/errands/${id}/`),
    refetchInterval: (query) => (query.state.data && LIVE.includes(query.state.data.status) ? 10_000 : false),
  });
  const badges = useQuery({
    queryKey: ["badges", errand?.agent?.id],
    queryFn: () => api<UserBadge[]>(`/trust/users/${errand!.agent!.id}/badges/`),
    enabled: Boolean(errand?.agent),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["errand", id] });
    queryClient.invalidateQueries({ queryKey: ["errands"] });
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
  };

  const act = async (action: string, body?: unknown) => {
    const updated = await api<Errand>(`/errands/${id}/${action}/`, { method: "POST", body });
    queryClient.setQueryData(["errand", id], updated);
    refresh();
  };

  if (isLoading) return <div className="p-4"><LoadingList /></div>;
  if (error || !errand) return <div className="p-4"><ErrorState error={error} onRetry={() => refetch()} /></div>;

  const progressIndex = PROGRESS.findIndex((p) => p.status === errand.status);

  return (
    <>
      <AppHeader back title={errand.title} subtitle={`Posted ${formatDateTime(errand.created_at)}`} />
      <div className="space-y-4 px-4 pb-6">
        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <ErrandTypeIcon type={errand.errand_type} className="h-6 w-6" />
            </div>
            <StatusBadge status={errand.status} />
          </div>
          {progressIndex >= 0 && (
            <ol className="mt-5 flex gap-1.5" aria-label="Progress">
              {PROGRESS.map((p, i) => (
                <li key={p.status} className="flex-1">
                  <div className={cn("h-1.5 rounded-full", i <= progressIndex ? "bg-brand" : "bg-muted")} />
                  <p className={cn("mt-1.5 text-[10px] leading-tight", i === progressIndex ? "font-semibold" : "text-muted-foreground")}>
                    {p.label}
                  </p>
                </li>
              ))}
            </ol>
          )}
          {errand.status === "open" && (
            <p className="mt-4 text-sm text-muted-foreground">Verified agents nearby can see your errand. You will be notified when one accepts.</p>
          )}
          {errand.status === "disputed" && (
            <p className="mt-4 text-sm text-muted-foreground">Tsumi support is reviewing this errand. Your money stays held until they decide.</p>
          )}
          {errand.cancel_reason && <p className="mt-4 text-sm text-muted-foreground">Reason: {errand.cancel_reason}</p>}
        </section>

        {errand.agent && (
          <section className="flex items-center gap-3 rounded-3xl border bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {errand.agent.display_name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{errand.agent.display_name}</p>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {badges.data?.map(({ badge }) => (
                  <span key={badge.code} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px]">
                    <BadgeCheck className="h-3 w-3 text-brand" aria-hidden /> {badge.name}
                  </span>
                ))}
              </div>
            </div>
            {errand.contact_phone && (
              <a
                href={`tel:${errand.contact_phone}`}
                aria-label={`Call ${errand.agent.display_name}`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-foreground"
              >
                <Phone className="h-5 w-5" />
              </a>
            )}
          </section>
        )}

        <section className="space-y-3 rounded-3xl border bg-card p-5 text-sm shadow-sm">
          <RouteMap
            pickup={parseCoords(errand.pickup_lat, errand.pickup_lng)}
            dropoff={parseCoords(errand.dropoff_lat, errand.dropoff_lng)}
          />
          {errand.pickup_address && (
            <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> {errand.pickup_address}</p>
          )}
          {errand.dropoff_address && (
            <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden /> {errand.dropoff_address}</p>
          )}
          {errand.description && <p className="whitespace-pre-wrap text-muted-foreground">{errand.description}</p>}
          <div className="flex items-center justify-between border-t pt-3">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-brand" aria-hidden />
              {errand.status === "completed" ? "Paid to agent" : ["cancelled", "refunded"].includes(errand.status) ? "Refunded to wallet" : "Held in TsumiSafe"}
            </span>
            <span className="text-lg font-semibold tabular-nums">{formatGhs(errand.price_pesewas)}</span>
          </div>
        </section>

        <div className="space-y-2">
          {errand.status === "delivered" && (
            <ActionSheet
              trigger={<Button size="xl" variant="brand" className="w-full"><Check /> Confirm and pay agent</Button>}
              title="Is everything done?"
              description={`We'll release ${formatGhs(errand.price_pesewas)} to ${errand.agent?.display_name ?? "the agent"}. This can't be undone.`}
              confirmLabel="Yes, release payment"
              confirmVariant="brand"
              onConfirm={async () => {
                await act("confirm");
                toast.success("Payment released. Thanks for using Tsumi!");
              }}
            />
          )}
          {errand.status === "completed" && !errand.is_rated && errand.agent && <RateSheet errand={errand} onDone={refresh} />}
          {(errand.status === "in_progress" || errand.status === "delivered") && (
            <DisputeSheet client={client} errand={errand} audience="customer" onDone={refresh} />
          )}
          {(errand.status === "open" || errand.status === "accepted") && (
            <ActionSheet
              trigger={<Button size="xl" variant="ghost" className="w-full text-destructive">Cancel errand</Button>}
              title="Cancel this errand?"
              description={`${formatGhs(errand.price_pesewas)} goes straight back to your Tsumi wallet.`}
              confirmLabel="Cancel errand"
              confirmVariant="destructive"
              field={{ label: "Why are you cancelling?", placeholder: "Plans changed" }}
              onConfirm={async (reason) => {
                await act("cancel", { reason });
                toast.success("Cancelled and refunded to your wallet.");
              }}
            />
          )}
        </div>

        {!!errand.events?.length && (
          <section className="rounded-3xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold">Timeline</h2>
            <ol className="space-y-3 border-l pl-4">
              {errand.events.map((event, i) => (
                <li key={i} className="relative text-sm">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />
                  <StatusBadge status={event.to_status} />
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(event.created_at)}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </>
  );
}
