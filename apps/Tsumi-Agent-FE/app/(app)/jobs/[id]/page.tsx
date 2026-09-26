"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Hourglass, MapPin, Navigation, Phone, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

import { ActionSheet } from "@tsumi/ui/components/action-sheet";
import { Button } from "@tsumi/ui/components/button";
import { DisputeSheet } from "@tsumi/ui/components/dispute-sheet";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { RouteMap } from "@tsumi/ui/components/route-map";
import { ErrorState, LoadingList } from "@tsumi/ui/components/states";
import { StatusBadge } from "@tsumi/ui/components/status-badge";
import { ApiError } from "@tsumi/ui/lib/api";
import { formatDateTime } from "@tsumi/ui/lib/format";
import { type LatLng, parseCoords } from "@tsumi/ui/lib/maps";
import { formatGhs } from "@tsumi/ui/lib/money";
import type { Errand } from "@tsumi/ui/lib/types";

import { AGENT_STATUS_LABELS } from "@/components/job-card";
import { api, client } from "@/lib/client";
import { mapsUrl } from "@/lib/jobs";

function Stop({
  label,
  address,
  coords,
  tone,
}: {
  label: string;
  address: string;
  coords: LatLng | null;
  tone: "muted" | "brand";
}) {
  return (
    <div className="flex items-center gap-3">
      <MapPin className={tone === "brand" ? "h-5 w-5 shrink-0 text-brand" : "h-5 w-5 shrink-0 text-muted-foreground"} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{address}</p>
      </div>
      <a
        href={mapsUrl(address, coords)}
        target="_blank"
        rel="noreferrer"
        aria-label={`Directions to ${label.toLowerCase()}`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
      >
        <Navigation className="h-4 w-4" />
      </a>
    </div>
  );
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [starting, setStarting] = useState(false);
  const { data: job, error, isLoading, refetch } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api<Errand>(`/errands/${id}/`),
    refetchInterval: (query) =>
      query.state.data && ["accepted", "in_progress", "delivered", "disputed"].includes(query.state.data.status) ? 15_000 : false,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["job", id] });
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
  };

  const act = async (action: "start" | "deliver") => {
    const updated = await api<Errand>(`/errands/${id}/${action}/`, { method: "POST" });
    queryClient.setQueryData(["job", id], updated);
    refresh();
  };

  if (isLoading) return <div className="p-4"><LoadingList /></div>;
  if (error || !job) return <div className="p-4"><ErrorState error={error} onRetry={() => refetch()} /></div>;
  const pickup = parseCoords(job.pickup_lat, job.pickup_lng);
  const dropoff = parseCoords(job.dropoff_lat, job.dropoff_lng);

  return (
    <>
      <AppHeader back title={job.title} subtitle={`Accepted ${formatDateTime(job.accepted_at)}`} />
      <div className="space-y-4 px-4 pb-6">
        <section className="rounded-3xl bg-gradient-to-br from-zinc-900 to-emerald-900 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">{job.status === "completed" ? "You earned" : "You'll earn"}</p>
            <StatusBadge status={job.status} labels={AGENT_STATUS_LABELS} />
          </div>
          <p className="mt-1 text-4xl font-bold tabular-nums">{formatGhs(job.agent_payout_pesewas)}</p>
          <p className="mt-1 text-xs text-white/70">Held in TsumiSafe. Paid to your wallet when the customer confirms.</p>
        </section>

        <section className="flex items-center gap-3 rounded-3xl border bg-card p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {job.customer.display_name.slice(0, 1)}
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="font-semibold">{job.customer.display_name}</p>
          </div>
          {job.contact_phone && (
            <a
              href={`tel:${job.contact_phone}`}
              aria-label={`Call ${job.customer.display_name}`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-foreground"
            >
              <Phone className="h-5 w-5" />
            </a>
          )}
        </section>

        <section className="space-y-4 rounded-3xl border bg-card p-5 shadow-sm">
          <RouteMap pickup={pickup} dropoff={dropoff} />
          {job.pickup_address && <Stop label="Pickup" address={job.pickup_address} coords={pickup} tone="muted" />}
          {job.dropoff_address && <Stop label="Drop-off" address={job.dropoff_address} coords={dropoff} tone="brand" />}
          {job.description && <p className="whitespace-pre-wrap border-t pt-3 text-sm text-muted-foreground">{job.description}</p>}
        </section>

        <div className="space-y-2">
          {job.status === "accepted" && (
            <>
              <Button
                size="xl"
                variant="brand"
                className="w-full"
                disabled={starting}
                onClick={async () => {
                  setStarting(true);
                  try {
                    await act("start");
                    toast.success("Started. The customer can see you're on it.");
                  } catch (err) {
                    toast.error(err instanceof ApiError ? err.message : "Could not start. Try again.");
                  } finally {
                    setStarting(false);
                  }
                }}
              >
                <Play /> {starting ? "Starting..." : "Start errand"}
              </Button>
              <ActionSheet
                trigger={<Button size="xl" variant="ghost" className="w-full">Can&apos;t do it? Release job</Button>}
                title="Release this job?"
                description="It goes back to the open list for another runner. Releasing often can affect your badges."
                confirmLabel="Release job"
                confirmVariant="destructive"
                onConfirm={async () => {
                  await api(`/errands/${id}/release/`, { method: "POST" });
                  refresh();
                  toast.success("Job released.");
                  router.replace("/");
                }}
              />
            </>
          )}
          {job.status === "in_progress" && (
            <ActionSheet
              trigger={<Button size="xl" variant="brand" className="w-full"><CheckCircle2 /> Mark as delivered</Button>}
              title="Is the errand done?"
              description="The customer is asked to confirm, then your payout is released."
              confirmLabel="Yes, it's delivered"
              confirmVariant="brand"
              onConfirm={async () => {
                await act("deliver");
                toast.success("Nice work! Waiting for the customer to confirm.");
              }}
            />
          )}
          {job.status === "delivered" && (
            <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4 text-sm">
              <Hourglass className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              Waiting for {job.customer.display_name} to confirm. You&apos;ll be notified when {formatGhs(job.agent_payout_pesewas)} lands in your wallet.
            </div>
          )}
          {(job.status === "in_progress" || job.status === "delivered") && (
            <DisputeSheet client={client} errand={job} audience="agent" onDone={refresh} />
          )}
        </div>
      </div>
    </>
  );
}
