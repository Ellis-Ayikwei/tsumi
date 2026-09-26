"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, ShieldCheck } from "lucide-react";
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
import { Textarea } from "@tsumi/ui/components/textarea";
import { ApiError } from "@tsumi/ui/lib/api";
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
    Boolean(draft.pickupAddress.trim() || draft.dropoffAddress.trim()),
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
          pickup_address: draft.pickupAddress.trim(),
          dropoff_address: draft.dropoffAddress.trim(),
          price_pesewas: pricePesewas,
        },
      });
      drafts.rememberDropoff(draft.dropoffAddress.trim());
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
      if (err instanceof ApiError && err.details[0]?.field === "price_pesewas") setStep(2);
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
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="errand-pickup">
                    Pickup {draft.errandType === "delivery" || draft.errandType === "pickup" ? "" : "(optional)"}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" aria-hidden />
                    <Input
                      id="errand-pickup"
                      className="h-12 rounded-xl pl-10"
                      placeholder="e.g. Osu, Oxford Street"
                      value={draft.pickupAddress}
                      onChange={(e) => update({ pickupAddress: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="errand-dropoff">Drop-off</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-brand" aria-hidden />
                    <Input
                      id="errand-dropoff"
                      className="h-12 rounded-xl pl-10"
                      placeholder="e.g. East Legon, American House"
                      value={draft.dropoffAddress}
                      onChange={(e) => update({ dropoffAddress: e.target.value })}
                    />
                  </div>
                </div>
              </>
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
                    {[draft.pickupAddress, draft.dropoffAddress].filter(Boolean).join(" to ")}
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
