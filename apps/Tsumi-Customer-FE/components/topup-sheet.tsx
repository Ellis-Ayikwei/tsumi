"use client";

import { useState } from "react";

import { AmountInput } from "@tsumi/ui/components/controls";
import { Button } from "@tsumi/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@tsumi/ui/components/drawer";
import { ApiError } from "@tsumi/ui/lib/api";
import { formatGhs, parseGhsToPesewas } from "@tsumi/ui/lib/money";
import type { Deposit } from "@tsumi/ui/lib/types";

import { api } from "@/lib/client";

const MIN_TOPUP_PESEWAS = 500;

/** Top up via Paystack (MoMo or card). The page leaves for Paystack's checkout and comes back to /wallet/topup. */
export function TopUpSheet({
  open,
  onOpenChange,
  initialPesewas,
  beforeRedirect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPesewas?: number;
  beforeRedirect?: () => void;
}) {
  const [amount, setAmount] = useState(initialPesewas ? String(initialPesewas / 100) : "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pesewas = parseGhsToPesewas(amount);

  async function pay() {
    if (!pesewas || pesewas < MIN_TOPUP_PESEWAS) {
      setError(`The smallest top up is ${formatGhs(MIN_TOPUP_PESEWAS)}.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const deposit = await api<Deposit>("/wallet/deposits/", { method: "POST", body: { amount_pesewas: pesewas } });
      beforeRedirect?.();
      window.location.assign(deposit.authorization_url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start the payment. Try again.");
      setBusy(false);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next && initialPesewas) setAmount(String(initialPesewas / 100));
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Top up wallet</DrawerTitle>
          <DrawerDescription>Pay with MTN MoMo, Telecel Cash, AirtelTigo Money or card.</DrawerDescription>
        </DrawerHeader>
        <div className="px-5 py-2">
          <AmountInput id="topup-amount" value={amount} onChange={setAmount} presetsPesewas={[2000, 5000, 10000, 20000]} />
        </div>
        {error && (
          <p role="alert" className="px-5 text-sm text-destructive">
            {error}
          </p>
        )}
        <DrawerFooter>
          <Button size="xl" onClick={pay} disabled={busy || !pesewas}>
            {busy ? "Opening Paystack..." : pesewas ? `Pay ${formatGhs(pesewas)}` : "Enter an amount"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
