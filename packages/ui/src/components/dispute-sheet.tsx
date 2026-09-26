"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError, type ApiClient } from "../lib/api";
import { formatGhs } from "../lib/money";
import type { Errand } from "../lib/types";
import { Button } from "./button";
import { ChoiceChips } from "./controls";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { Textarea } from "./textarea";

const REASONS = [
  { value: "not_delivered", label: "Not delivered" },
  { value: "damaged", label: "Damaged or wrong" },
  { value: "agent_no_show", label: "Agent didn't show" },
  { value: "overcharged", label: "Asked to pay extra" },
  { value: "other", label: "Something else" },
] as const;

type Reason = (typeof REASONS)[number]["value"];

/** "Report a problem" bottom sheet. Opening a dispute freezes the escrow until support decides. */
export function DisputeSheet({
  client,
  errand,
  audience,
  onDone,
}: {
  client: ApiClient;
  errand: Errand;
  audience: "customer" | "agent";
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Reason | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Agents are never "the agent who didn't show".
  const reasons = audience === "agent" ? REASONS.filter((r) => r.value !== "agent_no_show") : [...REASONS];

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await client.api("/disputes/", {
        method: "POST",
        body: { errand: errand.id, reason, description: description.trim() },
      });
      toast.success("Reported. Tsumi support will review it.");
      setOpen(false);
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send your report. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="xl" variant="ghost" className="w-full">
          Report a problem
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>What went wrong?</DrawerTitle>
          <DrawerDescription>
            The {formatGhs(errand.price_pesewas)} stays in TsumiSafe until support reviews it.
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 px-5 py-2">
          <ChoiceChips label="Reason" value={reason} onChange={setReason} options={reasons} />
          <Textarea
            aria-label="Describe the problem"
            className="min-h-28 rounded-xl"
            placeholder="Tell us what happened"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
        <DrawerFooter>
          <Button size="xl" variant="destructive" disabled={!reason || !description.trim() || busy} onClick={submit}>
            {busy ? "Sending..." : "Send report"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
