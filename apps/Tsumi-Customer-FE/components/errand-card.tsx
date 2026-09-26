import { ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@tsumi/ui/components/status-badge";
import { formatDateTime } from "@tsumi/ui/lib/format";
import { formatGhs } from "@tsumi/ui/lib/money";
import type { Errand } from "@tsumi/ui/lib/types";

import { ErrandTypeIcon } from "./errand-meta";

export function ErrandCard({ errand }: { errand: Errand }) {
  const needsYou = errand.status === "delivered";
  return (
    <Link
      href={`/errands/${errand.id}`}
      className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-transform active:scale-[0.99]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
        <ErrandTypeIcon type={errand.errand_type} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-medium">{errand.title}</p>
          <p className="shrink-0 text-sm font-semibold tabular-nums">{formatGhs(errand.price_pesewas)}</p>
        </div>
        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
          {errand.dropoff_address || errand.pickup_address}
        </p>
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={errand.status} />
          <span className="text-xs text-muted-foreground">
            {needsYou ? "Tap to confirm" : formatDateTime(errand.created_at)}
          </span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  );
}
