"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronRight, MapPin, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@tsumi/ui/components/button";
import { AmountInput, ChoiceChips } from "@tsumi/ui/components/controls";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@tsumi/ui/components/drawer";
import { Input } from "@tsumi/ui/components/input";
import { Label } from "@tsumi/ui/components/label";
import { LocationPicker } from "@tsumi/ui/components/location-picker";
import { Textarea } from "@tsumi/ui/components/textarea";
import { ApiError } from "@tsumi/ui/lib/api";
import type { Place } from "@tsumi/ui/lib/maps";
import { formatGhs, parseGhsToPesewas } from "@tsumi/ui/lib/money";
import type { Errand, ErrandType } from "@tsumi/ui/lib/types";
import { cn } from "@tsumi/ui/lib/utils";

import { api } from "@/lib/client";
import { type ErrandDraft, drafts, newDraft, SUGGESTED_PRICE_PESEWAS } from "@/lib/draft";

import { ERRAND_TYPES } from "./errand-meta";
import { TopUpSheet } from "./topup-sheet";

const STEPS = ["What", "Where", "Price"] as const;
const MIN_TOPUP_PESEWAS = 500;

const TITLE_PLACEHOLDER: Record<ErrandType, string> = {
  delivery: "Deliver a parcel to my sister",
  pickup: "Pick up my laptop from the repair shop",
  shopping: "Buy groceries at Makola",
  custom: "Queue at the passport office",
};

// One tap fills the title for the most common errands of each type.
const TITLE_SUGGESTIONS: Record<ErrandType, string[]> = {
  delivery: ["Deliver a parcel", "Send documents", "Deliver food"],
  pickup: ["Pick up a package", "Collect an item from a shop", "Pick up from the post office"],
  shopping: ["Buy groceries", "Buy medicine", "Refill my gas cylinder"],
  custom: ["Queue for me", "Pay a bill for me", "Drop off my laundry"],
};

/**
 * Three short steps in one bottom sheet. The draft is saved as the customer
 * types, and its client_request_id makes "Post errand" safe to tap twice.
 */
export function NewErrandSheet({
  open,
  onOpenChange,
  initialType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: ErrandType;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ErrandDraft | null>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [shortfall, setShortfall] = useState<number | null>(null);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState<"pickup" | "dropoff" | null>(null);

  useEffect(() => {
    if (!open) return;
    const saved = drafts.load();
    if (saved && (!initialType || saved.errandType === initialType)) {
      setDraft(saved);
    } else {
      setDraft(newDraft(initialType ?? "delivery"));
      setStep(0);
    }
    setError(null);
    setShortfall(null);
  }, [open, initialType]);

  useEffect(() => {
    if (draft) drafts.save(draft);
  }, [draft]);

  if (!draft) return null;
  const update = (patch: Partial<ErrandDraft>) => setDraft({ ...draft, ...patch });
  const pricePesewas = parseGhsToPesewas(draft.price);

  const stepValid = [
    draft.title.trim().length >= 3,
    Boolean(draft.pickup || draft.dropoff),
    Boolean(pricePesewas && pricePesewas > 0),
  ][step];

  async function post() {
    if (!draft || !pricePesewas) return;
    setBusy(true);
    setError(null);
    setShortfall(null);
    try {
      const errand = await api<Errand>("/errands/", {
        method: "POST",
        body: {
          client_request_id: draft.clientRequestId,
          errand_type: draft.errandType,
          title: draft.title.trim(),
          description: draft.description.trim(),
          pickup_address: draft.pickup?.address ?? "",
          pickup_lat: draft.pickup?.coords?.lat.toFixed(6) ?? null,
          pickup_lng: draft.pickup?.coords?.lng.toFixed(6) ?? null,
          dropoff_address: draft.dropoff?.address ?? "",
          dropoff_lat: draft.dropoff?.coords?.lat.toFixed(6) ?? null,
          dropoff_lng: draft.dropoff?.coords?.lng.toFixed(6) ?? null,
          price_pesewas: pricePesewas,
        },
      });
      drafts.rememberDropoff(draft.dropoff);
      drafts.clear();
      queryClient.invalidateQueries({ queryKey: ["errands"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Errand posted. We're finding you an agent.");
      onOpenChange(false);
      router.push(`/errands/${errand.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.code === "insufficient_funds") {
        setShortfall(Math.max(Number(err.meta.shortfall_pesewas), MIN_TOPUP_PESEWAS));
      }
      const field = err instanceof ApiError ? err.details[0]?.field : undefined;
      if (field === "price_pesewas") setStep(2);
      if (field?.startsWith("pickup_") || field?.startsWith("dropoff_")) setStep(1);
      setError(err instanceof ApiError ? err.message : "Could not post the errand. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  type="button"
                  aria-label="Previous step"
                  onClick={() => setStep(step - 1)}
                  className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <DrawerTitle>
                {step === 0 ? "What do you need?" : step === 1 ? "Where to?" : "Set your price"}
              </DrawerTitle>
            </div>
            <DrawerDescription>
              Step {step + 1} of {STEPS.length}
            </DrawerDescription>
            <div className="flex gap-1.5 pt-1" aria-hidden>
              {STEPS.map((s, i) => (
                <div key={s} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
          </DrawerHeader>

          <div className="space-y-4 px-5 py-3">
            {step === 0 && (
              <>
                <ChoiceChips
                  label="Errand type"
                  value={draft.errandType}
                  options={ERRAND_TYPES.map(({ value, label, Icon }) => ({
                    value,
                    label,
                    icon: <Icon className="h-4 w-4" />,
                  }))}
                  onChange={(errandType) => {
                    // Move the suggested price with the type unless the customer typed their own.
                    const untouched = draft.price === String(SUGGESTED_PRICE_PESEWAS[draft.errandType] / 100);
                    update({
                      errandType,
                      price: untouched ? String(SUGGESTED_PRICE_PESEWAS[errandType] / 100) : draft.price,
                    });
                  }}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="errand-title">Short title</Label>
                  <Input
                    id="errand-title"
                    className="h-12 rounded-xl"
                    placeholder={TITLE_PLACEHOLDER[draft.errandType]}
                    value={draft.title}
                    onChange={(e) => update({ title: e.target.value })}
                    maxLength={200}
                  />
                  <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pt-1">
                    {TITLE_SUGGESTIONS[draft.errandType].map((title) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => update({ title })}
                        className={cn(
                          "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95",
                          draft.title === title ? "border-primary bg-primary/10" : "hover:bg-accent"
                        )}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="errand-notes">Details for your agent (optional)</Label>
                  <Textarea
                    id="errand-notes"
                    className="min-h-24 rounded-xl"
                    placeholder="Item list, who to ask for, gate colour..."
                    value={draft.description}
                    onChange={(e) => update({ description: e.target.value })}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <div className="divide-y overflow-hidden rounded-2xl border">
                {(["pickup", "dropoff"] as const).map((stop) => {
                  const place: Place | null = draft[stop];
                  const optional = stop === "pickup" && draft.errandType !== "delivery" && draft.errandType !== "pickup";
                  return (
                    <div key={stop} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setPicking(stop)}
                        className="flex min-w-0 flex-1 items-center gap-3 p-4 text-left hover:bg-accent"
                      >
                        <MapPin
                          className={cn("h-5 w-5 shrink-0", stop === "pickup" ? "text-muted-foreground" : "text-brand")}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs text-muted-foreground">
                            {stop === "pickup" ? "Pickup" : "Drop-off"} {optional && "(optional)"}
                          </span>
                          <span className={cn("block truncate text-sm", !place && "text-muted-foreground")}>
                            {place?.address ?? (stop === "pickup" ? "Where should the agent start?" : "Where should it end up?")}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      </button>
                      {place && (
                        <button
                          type="button"
                          aria-label={`Clear ${stop === "pickup" ? "pickup" : "drop-off"}`}
                          onClick={() => update(stop === "pickup" ? { pickup: null } : { dropoff: null })}
                          className="mr-2 rounded-full px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {step === 2 && (
              <>
                <AmountInput
                  id="errand-price"
                  label="Price"
                  value={draft.price}
                  onChange={(price) => update({ price })}
                  presetsPesewas={[2000, 3000, 5000, 8000]}
                />
                <div className="flex gap-3 rounded-2xl bg-muted/60 p-4 text-sm">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-brand" aria-hidden />
                  <p>
                    <span className="font-medium">Protected by TsumiSafe.</span> We hold the money and only pay the
                    agent after you confirm the errand is done.
                  </p>
                </div>
                <div className="rounded-2xl border p-4 text-sm">
                  <p className="font-medium">{draft.title}</p>
                  <p className="text-muted-foreground">
                    {[draft.pickup?.address, draft.dropoff?.address].filter(Boolean).join(" to ")}
                  </p>
                </div>
              </>
            )}

            {error && (
              <div role="alert" className="space-y-2 rounded-2xl border border-destructive/40 p-3 text-sm">
                <p className="text-destructive">{error}</p>
                {shortfall !== null && (
                  <Button size="sm" className="rounded-full" onClick={() => setTopUpOpen(true)}>
                    Top up {formatGhs(shortfall)}
                  </Button>
                )}
              </div>
            )}
          </div>

          <DrawerFooter>
            {step < STEPS.length - 1 ? (
              <Button size="xl" disabled={!stepValid} onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            ) : (
              <Button size="xl" disabled={!stepValid || busy} onClick={post}>
                {busy ? "Posting..." : pricePesewas ? `Post errand for ${formatGhs(pricePesewas)}` : "Post errand"}
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <LocationPicker
        open={picking !== null}
        onOpenChange={(next) => !next && setPicking(null)}
        title={picking === "pickup" ? "Pickup location" : "Drop-off location"}
        confirmLabel={picking === "pickup" ? "Set pickup here" : "Set drop-off here"}
        value={picking === "pickup" ? draft.pickup : draft.dropoff}
        onPick={(place) => update(picking === "pickup" ? { pickup: place } : { dropoff: place })}
      />
      {shortfall !== null && (
        <TopUpSheet
          open={topUpOpen}
          onOpenChange={setTopUpOpen}
          initialPesewas={shortfall}
          beforeRedirect={() => drafts.markResume()}
        />
      )}
    </>
  );
}
