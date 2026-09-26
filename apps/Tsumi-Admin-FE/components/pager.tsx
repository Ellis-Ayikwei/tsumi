import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Page } from "@/lib/types";

export function Pager<T>({ page, data, onPage }: { page: number; data?: Page<T>; onPage: (p: number) => void }) {
  if (!data || (!data.next && !data.previous)) return null;
  return (
    <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
      <span>{data.count.toLocaleString()} total</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={!data.previous} onClick={() => onPage(page - 1)}>
          <ChevronLeft /> Previous
        </Button>
        <Button variant="outline" size="sm" disabled={!data.next} onClick={() => onPage(page + 1)}>
          Next <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
