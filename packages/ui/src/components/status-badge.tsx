import { AlertTriangle, CheckCircle2, CircleDot, Clock, RotateCcw, XCircle } from "lucide-react";

import { humanize } from "../lib/format";
import { Badge, type BadgeProps } from "./badge";

type Tone = NonNullable<BadgeProps["variant"]>;

// Status is never shown by color alone: every badge carries an icon and its label.
const TONES: Record<string, { variant: Tone; Icon: typeof CircleDot; label?: string }> = {
  open: { variant: "info", Icon: CircleDot, label: "Finding an agent" },
  accepted: { variant: "info", Icon: Clock, label: "Agent assigned" },
  in_progress: { variant: "info", Icon: Clock, label: "In progress" },
  delivered: { variant: "warning", Icon: Clock, label: "Awaiting confirmation" },
  completed: { variant: "success", Icon: CheckCircle2 },
  disputed: { variant: "destructive", Icon: AlertTriangle, label: "Under review" },
  cancelled: { variant: "secondary", Icon: XCircle },
  refunded: { variant: "secondary", Icon: RotateCcw },
  pending: { variant: "warning", Icon: Clock },
  succeeded: { variant: "success", Icon: CheckCircle2 },
  failed: { variant: "destructive", Icon: XCircle },
  paid: { variant: "success", Icon: CheckCircle2 },
  rejected: { variant: "destructive", Icon: XCircle },
  approved: { variant: "success", Icon: CheckCircle2, label: "Verified" },
  not_submitted: { variant: "secondary", Icon: CircleDot, label: "Not verified" },
};

/** `labels` lets an app phrase a status for its audience (agent vs customer). */
export function StatusBadge({ status, labels }: { status: string; labels?: Record<string, string> }) {
  const tone = TONES[status] ?? { variant: "outline" as Tone, Icon: CircleDot };
  return (
    <Badge variant={tone.variant} className="rounded-full">
      <tone.Icon aria-hidden />
      {labels?.[status] ?? tone.label ?? humanize(status)}
    </Badge>
  );
}
