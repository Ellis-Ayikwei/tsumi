import { MapPin } from "lucide-react";

import { StatusBadge } from "@tsumi/ui/components/status-badge";
import { formatDateTime, humanize } from "@tsumi/ui/lib/format";
import { formatGhs } from "@tsumi/ui/lib/money";
import type { Errand } from "@tsumi/ui/lib/types";

// Agent-facing wording for statuses.
export const AGENT_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  accepted: "Accepted, not started",
  in_progress: "In progress",
  delivered: "Waiting for customer",
  completed: "Paid",
};

/** Payout first: it's what an agent scans for. */
export function JobCard({ job, showStatus = false }: { job: Errand; showStatus?: boolean }) {
  return (
    <div className="space-y-3 rounded-3xl border bg-card p-4 text-left shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{humanize(job.errand_type)}</p>
          <p className="truncate font-semibold">{job.title}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-bold tabular-nums text-brand">{formatGhs(job.agent_payout_pesewas)}</p>
          <p className="text-[11px] text-muted-foreground">you earn</p>
        </div>
      </div>
      <div className="space-y-1 text-sm">
        {job.pickup_address && (
          <p className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> {job.pickup_address}
          </p>
        )}
        {job.dropoff_address && (
          <p className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden /> {job.dropoff_address}
          </p>
        )}
        {job.stops.length > 2 && (
          <p className="pl-6 text-xs text-muted-foreground">
            +{job.stops.length - 2} more {job.stops.length - 2 === 1 ? "stop" : "stops"} on the way
          </p>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {showStatus ? <StatusBadge status={job.status} labels={AGENT_STATUS_LABELS} /> : <span>Posted {formatDateTime(job.created_at)}</span>}
        <span>{job.customer.display_name}</span>
      </div>
    </div>
  );
}
