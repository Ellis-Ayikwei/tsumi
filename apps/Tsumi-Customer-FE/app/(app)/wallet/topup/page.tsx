"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Button } from "@tsumi/ui/components/button";
import { formatGhs } from "@tsumi/ui/lib/money";
import type { Deposit } from "@tsumi/ui/lib/types";

import { api } from "@/lib/client";
import { drafts } from "@/lib/draft";

// Paystack's webhook usually lands within seconds; after this we stop polling and say so.
const POLL_FOR_MS = 60_000;

function TopUpResult() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reference = useSearchParams().get("reference") ?? "";
  const [startedAt] = useState(() => Date.now());
  const [timedOut, setTimedOut] = useState(false);
  const [resumeErrand] = useState(() => drafts.load() !== null);

  const { data, error } = useQuery({
    queryKey: ["deposit", reference],
    queryFn: () => api<Deposit>(`/wallet/deposits/${encodeURIComponent(reference)}/`),
    enabled: Boolean(reference),
    refetchInterval: (query) =>
      query.state.data?.status === "pending" && Date.now() - startedAt < POLL_FOR_MS ? 2_000 : false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), POLL_FOR_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data?.status === "succeeded") queryClient.invalidateQueries({ queryKey: ["wallet"] });
  }, [data?.status, queryClient]);

  const status = !reference || error ? "failed" : data?.status ?? "pending";

  const continueTo = () => {
    if (resumeErrand) drafts.markResume();
    router.replace(resumeErrand ? "/" : "/wallet");
  };

  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center gap-4 px-6 text-center">
      {status === "succeeded" && <CheckCircle2 className="h-16 w-16 text-brand" aria-hidden />}
      {status === "pending" && <Clock className="h-16 w-16 animate-pulse text-muted-foreground" aria-hidden />}
      {status === "failed" && <XCircle className="h-16 w-16 text-destructive" aria-hidden />}
      <h1 className="text-2xl font-bold">
        {status === "succeeded" ? "Wallet topped up" : status === "failed" ? "Payment didn't go through" : "Confirming your payment"}
      </h1>
      <p className="text-muted-foreground">
        {status === "succeeded" && data && `${formatGhs(data.amount_pesewas)} is now in your wallet.`}
        {status === "pending" && !timedOut && "This usually takes a few seconds. Keep this page open."}
        {status === "pending" && timedOut && "Still waiting on the payment provider. Your wallet updates automatically once it confirms."}
        {status === "failed" && "No money was added. If you were charged, it will be reversed by your provider."}
      </p>
      {(status !== "pending" || timedOut) && (
        <Button size="xl" className="w-full max-w-xs" onClick={continueTo}>
          {resumeErrand && status === "succeeded" ? "Continue your errand" : "Back to wallet"}
        </Button>
      )}
    </div>
  );
}

export default function TopUpReturnPage() {
  return (
    <Suspense>
      <TopUpResult />
    </Suspense>
  );
}
