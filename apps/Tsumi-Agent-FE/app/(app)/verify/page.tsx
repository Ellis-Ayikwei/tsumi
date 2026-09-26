"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, CheckCircle2, Clock, FileCheck2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@tsumi/ui/components/button";
import { ChoiceChips } from "@tsumi/ui/components/controls";
import { Input } from "@tsumi/ui/components/input";
import { Label } from "@tsumi/ui/components/label";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { ErrorState, LoadingList } from "@tsumi/ui/components/states";
import { ApiError } from "@tsumi/ui/lib/api";
import type { AgentMe, AgentProfile } from "@tsumi/ui/lib/types";
import { cn } from "@tsumi/ui/lib/utils";

import { client } from "@/lib/client";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

const ID_TYPES = [
  { value: "ghana_card", label: "Ghana Card" },
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's licence" },
  { value: "voter_id", label: "Voter ID" },
] as const;

const VEHICLES = [
  { value: "motorbike", label: "Motorbike" },
  { value: "car", label: "Car" },
  { value: "bicycle", label: "Bicycle" },
  { value: "walking", label: "On foot" },
] as const;

function FilePick({
  id,
  label,
  hint,
  capture,
  file,
  onFile,
}: {
  id: string;
  label: string;
  hint: string;
  capture: "user" | "environment";
  file: File | null;
  onFile: (file: File | null, error?: string) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-4 transition-colors hover:bg-accent",
        file && "border-solid border-brand bg-brand/5"
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
        {file ? <FileCheck2 className="h-5 w-5 text-brand" /> : <Camera className="h-5 w-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{file ? file.name : hint}</span>
      </span>
      <input
        id={id}
        type="file"
        accept={ACCEPT}
        capture={capture}
        className="sr-only"
        onChange={(e) => {
          const picked = e.target.files?.[0] ?? null;
          if (picked && picked.size > MAX_BYTES) onFile(null, "That file is over 5 MB. Retake it or pick a smaller one.");
          else onFile(picked);
        }}
      />
    </label>
  );
}

export default function VerifyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const me = useQuery({ queryKey: ["agent-me"], queryFn: () => client.api<AgentMe>("/agents/me/") });
  const [idType, setIdType] = useState<(typeof ID_TYPES)[number]["value"]>("ghana_card");
  const [idNumber, setIdNumber] = useState("");
  const [vehicle, setVehicle] = useState<AgentProfile["vehicle_type"]>("motorbike");
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (me.isLoading) return <div className="p-4"><LoadingList /></div>;
  if (me.error || !me.data) return <div className="p-4"><ErrorState error={me.error} onRetry={() => me.refetch()} /></div>;
  const status = me.data.kyc_status;

  async function submit() {
    if (!idDocument || !selfie) return;
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.set("id_type", idType);
    form.set("id_number", idNumber.trim());
    form.set("vehicle_type", vehicle);
    form.set("id_document", idDocument);
    form.set("selfie", selfie);
    try {
      await client.apiForm("/agents/me/kyc/", form);
      queryClient.invalidateQueries({ queryKey: ["agent-me"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Submitted. We'll notify you once you're verified.");
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "approved" || status === "pending") {
    return (
      <>
        <AppHeader back title="Verification" />
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          {status === "approved" ? (
            <CheckCircle2 className="h-16 w-16 text-brand" aria-hidden />
          ) : (
            <Clock className="h-16 w-16 text-muted-foreground" aria-hidden />
          )}
          <h1 className="text-2xl font-bold">{status === "approved" ? "You're verified" : "We're reviewing your ID"}</h1>
          <p className="text-muted-foreground">
            {status === "approved"
              ? "Customers see your Verified ID badge on every job."
              : "Most reviews finish within a day. We'll send you a notification."}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader back title="Verify your identity" />
      <div className="space-y-6 px-4 pb-8">
        {status === "rejected" && me.data.kyc_rejection_reason && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold">Please fix this and resubmit</p>
            <p className="text-muted-foreground">{me.data.kyc_rejection_reason}</p>
          </div>
        )}
        <section className="space-y-2">
          <Label>ID type</Label>
          <ChoiceChips label="ID type" value={idType} onChange={setIdType} options={[...ID_TYPES]} />
        </section>
        <section className="grid gap-1.5">
          <Label htmlFor="id-number">ID number</Label>
          <Input
            id="id-number"
            className="h-12 rounded-xl"
            placeholder={idType === "ghana_card" ? "GHA-123456789-0" : ""}
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
        </section>
        <section className="space-y-3">
          <FilePick
            id="id-document"
            label="Photo of your ID"
            hint="Flat, in good light, all four corners visible"
            capture="environment"
            file={idDocument}
            onFile={(file, err) => {
              setIdDocument(file);
              setError(err ?? null);
            }}
          />
          <FilePick
            id="selfie"
            label="Selfie"
            hint="Face the camera, no hat or sunglasses"
            capture="user"
            file={selfie}
            onFile={(file, err) => {
              setSelfie(file);
              setError(err ?? null);
            }}
          />
        </section>
        <section className="space-y-2">
          <Label>How do you get around?</Label>
          <ChoiceChips label="Vehicle" value={vehicle} onChange={setVehicle} options={[...VEHICLES]} />
        </section>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button size="xl" className="w-full" disabled={busy || !idNumber.trim() || !idDocument || !selfie} onClick={submit}>
          {busy ? "Uploading..." : "Submit for review"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Your documents are only seen by the Tsumi verification team.
        </p>
      </div>
    </>
  );
}
