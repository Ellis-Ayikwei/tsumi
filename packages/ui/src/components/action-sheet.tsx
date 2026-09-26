"use client";

import { useState } from "react";

import { ApiError } from "../lib/api";
import { Button, type ButtonProps } from "./button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { Label } from "./label";
import { Textarea } from "./textarea";

/**
 * Bottom-sheet confirmation for irreversible actions (pay, cancel, withdraw).
 * Optionally collects one text value and shows the API's error inline.
 */
export function ActionSheet({
  trigger,
  title,
  description,
  confirmLabel,
  confirmVariant = "default",
  field,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  confirmVariant?: ButtonProps["variant"];
  field?: { label: string; placeholder?: string; required?: boolean };
  onConfirm: (value: string) => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const missing = Boolean(field?.required && !value.trim());

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      await onConfirm(value.trim());
      setOpen(false);
      setValue("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={(next) => { setOpen(next); if (!next) setError(null); }}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription asChild>
            <div>{description}</div>
          </DrawerDescription>
        </DrawerHeader>
        {field && (
          <div className="grid gap-2 px-5 py-2">
            <Label htmlFor="action-sheet-field">
              {field.label}
              {field.required ? "" : " (optional)"}
            </Label>
            <Textarea
              id="action-sheet-field"
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => setValue(e.target.value)}
              className="rounded-xl"
            />
          </div>
        )}
        {error && (
          <p role="alert" className="px-5 text-sm text-destructive">
            {error}
          </p>
        )}
        <DrawerFooter>
          <Button size="xl" variant={confirmVariant} disabled={busy || missing} onClick={confirm}>
            {busy ? "Working..." : confirmLabel}
          </Button>
          <Button size="xl" variant="ghost" onClick={() => setOpen(false)}>
            Not now
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
