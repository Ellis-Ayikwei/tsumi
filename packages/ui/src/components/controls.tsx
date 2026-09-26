"use client";

import { Star } from "lucide-react";

import { formatGhs, parseGhsToPesewas } from "../lib/money";
import { cn } from "../lib/utils";

/** Single-choice pill row. */
export function ChoiceChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T | null;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95",
            value === option.value ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-accent"
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Big GHS amount field with quick-pick presets (in pesewas). */
export function AmountInput({
  value,
  onChange,
  presetsPesewas = [],
  id = "amount",
  label = "Amount",
}: {
  value: string;
  onChange: (value: string) => void;
  presetsPesewas?: number[];
  id?: string;
  label?: string;
}) {
  const invalid = value !== "" && (parseGhsToPesewas(value) ?? 0) <= 0;
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="sr-only">
        {label} in GHS
      </label>
      <div
        className={cn(
          "flex items-baseline gap-2 rounded-2xl border bg-muted/40 px-4 py-3 focus-within:ring-2 focus-within:ring-ring",
          invalid && "border-destructive"
        )}
      >
        <span className="text-lg font-medium text-muted-foreground">GHS</span>
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-4xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/50"
        />
      </div>
      {invalid && <p className="text-sm text-destructive">Enter an amount like 25 or 25.50.</p>}
      {presetsPesewas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presetsPesewas.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(String(p / 100))}
              className="rounded-full border px-3 py-1.5 text-sm tabular-nums hover:bg-accent active:scale-95"
            >
              {formatGhs(p).replace(".00", "")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-brand" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function StarRating({ value, onChange }: { value: number; onChange: (stars: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Rating" className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="transition-transform active:scale-90"
        >
          <Star className={cn("h-10 w-10", n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
        </button>
      ))}
    </div>
  );
}

/** Two to four tabs as a pill segmented control. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="tablist" className="grid rounded-full bg-muted p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full py-2 text-sm font-medium transition-all",
            value === option.value ? "bg-background shadow-sm" : "text-muted-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
