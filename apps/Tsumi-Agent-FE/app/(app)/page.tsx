"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, ShieldAlert, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@tsumi/ui/components/button";
import { Switch } from "@tsumi/ui/components/controls";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@tsumi/ui/components/drawer";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { EmptyState, ErrorState, LoadingList } from "@tsumi/ui/components/states";
import { ApiError } from "@tsumi/ui/lib/api";
import { formatGhs } from "@tsumi/ui/lib/money";
import type { AgentMe, Errand, NotificationPage, Page } from "@tsumi/ui/lib/types";

import { JobCard } from "@/components/job-card";
import { api } from "@/lib/client";

function JobSheet({ job, onClose }: { job: Errand | null; onClose: () => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  async function accept() {
    if (!job) return;
    setBusy(true);
    try {
      await api(`/errands/${job.id}/accept/`, { method: "POST" });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job accepted. Head to the pickup.");
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      const taken = err instanceof ApiError && (err.status === 409 || err.status === 404);
      toast.error(
        taken && err.message.includes("active errands")
          ? err.message
          : taken
            ? "Another runner took this job."
            : err instanceof ApiError
              ? err.message
              : "Could not accept. Try again."
      );
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer open={job !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        {job && (
          <>
            <DrawerHeader>
              <DrawerTitle>{job.title}</DrawerTitle>
              <DrawerDescription>For {job.customer.display_name}</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 px-5 py-2">
              <div className="rounded-2xl bg-brand/10 p-4 text-center">
                <p className="text-sm text-muted-foreground">You earn</p>
                <p className="text-4xl font-bold tabular-nums text-brand">{formatGhs(job.agent_payout_pesewas)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Already paid into TsumiSafe by the customer</p>
              </div>
              <JobCard job={job} />
              {job.description && <p className="whitespace-pre-wrap text-sm text-muted-foreground">{job.description}</p>}
            </div>
            <DrawerFooter>
              <Button size="xl" variant="brand" onClick={accept} disabled={busy}>
                {busy ? "Accepting..." : "Accept job"}
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default function JobsPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Errand | null>(null);
  const me = useQuery({ queryKey: ["agent-me"], queryFn: () => api<AgentMe>("/agents/me/") });
  const verified = me.data?.kyc_status === "approved";
  const online = Boolean(me.data?.is_available);
  const jobs = useQuery({
    queryKey: ["jobs", "available"],
    queryFn: () => api<Page<Errand>>("/errands/?scope=available"),
    enabled: verified && online,
    refetchInterval: 15_000,
  });
  const unread = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => api<NotificationPage>("/notifications/?unread=1&page_size=1"),
    refetchInterval: 30_000,
  });

  async function setOnline(next: boolean) {
    queryClient.setQueryData<AgentMe>(["agent-me"], (old) => (old ? { ...old, is_available: next } : old));
    try {
      await api("/agents/me/", { method: "PATCH", body: { is_available: next } });
    } catch {
      toast.error("Couldn't change your status. Try again.");
    }
    queryClient.invalidateQueries({ queryKey: ["agent-me"] });
  }

  return (
    <>
      <AppHeader
        large
        title="Open jobs"
        subtitle={online ? "New errands appear here automatically" : "Go online to see errands"}
        actions={
          <Link href="/notifications" aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full border">
            <Bell className="h-5 w-5" />
            {!!unread.data?.unread_count && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
            )}
          </Link>
        }
      />
      <div className="space-y-4 px-4">
        {me.data && !verified && (
          <Link href="/verify" className="flex items-center gap-3 rounded-3xl border border-amber-500/40 bg-amber-50 p-4 dark:bg-amber-950/40">
            <ShieldAlert className="h-6 w-6 shrink-0 text-amber-600" aria-hidden />
            <div className="text-sm">
              <p className="font-semibold">
                {me.data.kyc_status === "pending" ? "Verification in review" : me.data.kyc_status === "rejected" ? "Verification needs a fix" : "Verify your identity"}
              </p>
              <p className="text-muted-foreground">
                {me.data.kyc_status === "pending"
                  ? "We'll notify you as soon as you're approved."
                  : "You can accept errands once Tsumi verifies your ID. It takes 2 minutes."}
              </p>
            </div>
          </Link>
        )}

        {verified && (
          <section className="flex items-center justify-between rounded-3xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={online ? "flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-brand" : "flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground"}>
                {online ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-semibold">{online ? "You're online" : "You're offline"}</p>
                <p className="text-xs text-muted-foreground">{online ? "Customers can be matched with you" : "You won't see new jobs"}</p>
              </div>
            </div>
            <Switch checked={online} onCheckedChange={setOnline} label="Available for jobs" />
          </section>
        )}

        {verified && online && (
          <>
            {jobs.isLoading && <LoadingList />}
            {jobs.error && <ErrorState error={jobs.error} onRetry={() => jobs.refetch()} />}
            {jobs.data?.results.length === 0 && (
              <EmptyState title="No open jobs right now" hint="Stay online. We check for new errands every few seconds." />
            )}
            <div className="space-y-3">
              {jobs.data?.results.map((job) => (
                <button key={job.id} type="button" className="block w-full transition-transform active:scale-[0.99]" onClick={() => setSelected(job)}>
                  <JobCard job={job} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <JobSheet job={selected} onClose={() => setSelected(null)} />
    </>
  );
}
