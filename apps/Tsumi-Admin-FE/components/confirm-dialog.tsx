"use client";

import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";

interface Field {
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  defaultValue?: string;
}

/**
 * Confirmation for irreversible actions (money moves, suspensions, KYC decisions).
 * Optionally collects one text value (a reason or a payout reference) and shows
 * the API's error inline so the admin can fix it without losing the dialog.
 */
export function ConfirmDialog({
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
  field?: Field;
  onConfirm: (value: string) => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(field?.defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const missing = Boolean(field?.required && !value.trim());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (missing) return;
    setBusy(true);
    setError(null);
    try {
      await onConfirm(value.trim());
      setOpen(false);
      setValue(field?.defaultValue ?? "");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription asChild>
              <div>{description}</div>
            </DialogDescription>
          </DialogHeader>
          {field && (
            <div className="grid gap-2">
              <Label htmlFor="confirm-field">
                {field.label}
                {field.required ? "" : " (optional)"}
              </Label>
              {field.multiline ? (
                <Textarea
                  id="confirm-field"
                  autoFocus
                  value={value}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(e.target.value)}
                />
              ) : (
                <Input
                  id="confirm-field"
                  autoFocus
                  value={value}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(e.target.value)}
                />
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant={confirmVariant} disabled={busy || missing}>
              {busy ? "Working..." : confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
