import { Bike, Package, ShoppingBag, Sparkles } from "lucide-react";

import type { ErrandType } from "@tsumi/ui/lib/types";

export const ERRAND_TYPES: { value: ErrandType; label: string; hint: string; Icon: typeof Package }[] = [
  { value: "delivery", label: "Delivery", hint: "Send something across town", Icon: Bike },
  { value: "pickup", label: "Pickup", hint: "Collect and bring it to you", Icon: Package },
  { value: "shopping", label: "Shopping", hint: "Buy from a shop or market", Icon: ShoppingBag },
  { value: "custom", label: "Anything", hint: "Queue, pay a bill, drop keys", Icon: Sparkles },
];

export function ErrandTypeIcon({ type, className }: { type: ErrandType; className?: string }) {
  const Icon = ERRAND_TYPES.find((t) => t.value === type)?.Icon ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
