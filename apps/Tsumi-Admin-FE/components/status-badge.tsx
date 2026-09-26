import { AlertTriangle, CheckCircle2, CircleDot, Clock, RotateCcw, XCircle } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { humanize } from "@/lib/format";

type Tone = NonNullable<BadgeProps["variant"]>;

// Status is never shown by color alone: every badge carries an icon and its label.
const TONES: Record<string, { variant: Tone; Icon: typeof CircleDot }> = {
  open: { variant: "info", Icon: CircleDot },
  accepted: { variant: "info", Icon: Clock },
  in_progress: { variant: "info", Icon: Clock },
  delivered: { variant: "warning", Icon: Clock },
  completed: { variant: "success", Icon: CheckCircle2 },
  disputed: { variant: "destructive", Icon: AlertTriangle },
  cancelled: { variant: "secondary", Icon: XCircle },
  refunded: { variant: "secondary", Icon: RotateCcw },
  held: { variant: "warning", Icon: Clock },
  released: { variant: "success", Icon: CheckCircle2 },
  pending: { variant: "warning", Icon: Clock },
  approved: { variant: "success", Icon: CheckCircle2 },
  rejected: { variant: "destructive", Icon: XCircle },
  not_submitted: { variant: "secondary", Icon: CircleDot },
  paid: { variant: "success", Icon: CheckCircle2 },
  resolved: { variant: "success", Icon: CheckCircle2 },
  active: { variant: "success", Icon: CheckCircle2 },
  suspended: { variant: "destructive", Icon: XCircle },
};

export function StatusBadge({ status }: { status: string }) {
  const tone = TONES[status] ?? { variant: "outline" as Tone, Icon: CircleDot };
  return (
    <Badge variant={tone.variant}>
      <tone.Icon aria-hidden />
      {humanize(status)}
    </Badge>
  );
}
