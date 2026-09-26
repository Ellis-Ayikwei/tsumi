import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { formatDateTime } from "../lib/format";
import { formatGhs } from "../lib/money";
import { ENTRY_LABELS, type LedgerEntry } from "../lib/types";
import { cn } from "../lib/utils";

/** One wallet ledger line. Links to its errand when it has one (at `${errandHref}/<id>`). */
export function LedgerRow({ entry, errandHref }: { entry: LedgerEntry; errandHref?: string }) {
  const credit = entry.amount_pesewas > 0;
  const body = (
    <div className="flex items-center gap-3 py-3">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          credit ? "bg-brand/10 text-brand" : "bg-muted"
        )}
      >
        {credit ? <ArrowDownLeft className="h-4 w-4" aria-hidden /> : <ArrowUpRight className="h-4 w-4" aria-hidden />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{ENTRY_LABELS[entry.entry_type] ?? entry.entry_type}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(entry.created_at)}</p>
      </div>
      <p className={cn("text-sm font-semibold tabular-nums", credit && "text-brand")}>
        {credit ? "+" : ""}
        {formatGhs(entry.amount_pesewas)}
      </p>
    </div>
  );
  return entry.errand && errandHref ? <Link href={`${errandHref}/${entry.errand}`}>{body}</Link> : body;
}
