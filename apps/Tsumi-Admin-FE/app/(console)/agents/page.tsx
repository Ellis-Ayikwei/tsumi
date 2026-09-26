"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { Pager } from "@/components/pager";
import { EmptyState, ErrorState, LoadingRows } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { api, apiBlob, ApiError, qs } from "@/lib/api";
import { formatDateTime, fullName, humanize } from "@/lib/format";
import type { AdminUser, KycStatus, Page } from "@/lib/types";

function KycDocument({ userId, which, label }: { userId: string; which: "id_document" | "selfie"; label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [type, setType] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    apiBlob(`/admin/users/${userId}/kyc/${which}/`)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setType(blob.type);
        setUrl(objectUrl);
      })
      .catch(() => setFailed(true));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [userId, which]);

  return (
    <figure className="space-y-1">
      <figcaption className="text-xs text-muted-foreground">{label}</figcaption>
      {failed && <p className="text-sm text-destructive">Could not load file.</p>}
      {!failed && !url && <div className="h-48 animate-pulse rounded-md bg-muted" />}
      {url && type.startsWith("image/") && (
        // eslint-disable-next-line @next/next/no-img-element -- blob URL, next/image cannot optimize it
        <img src={url} alt={label} className="max-h-72 w-full rounded-md border object-contain" />
      )}
      {url && !type.startsWith("image/") && (
        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline">
          <FileText className="h-4 w-4" /> Open {label.toLowerCase()} (PDF)
        </a>
      )}
    </figure>
  );
}

function ReviewCard({ agent, onDone }: { agent: AdminUser; onDone: () => void }) {
  const profile = agent.agent_profile;
  const approve = useMutation({
    mutationFn: () => api(`/admin/users/${agent.id}/kyc/`, { method: "POST", body: { decision: "approve" } }),
    onSuccess: () => {
      toast.success(`${fullName(agent)} is verified and can take errands.`);
      onDone();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Approval failed."),
  });
  if (!profile) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">{fullName(agent)}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {agent.email} · {agent.phone_number ?? "no phone"}
          </p>
          <p className="text-sm text-muted-foreground">
            {humanize(profile.id_type || "unknown ID")} {profile.id_number} · {humanize(profile.vehicle_type)} ·
            submitted {formatDateTime(profile.kyc_submitted_at)}
          </p>
        </div>
        <StatusBadge status={profile.kyc_status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {profile.has_id_document && <KycDocument userId={agent.id} which="id_document" label="ID document" />}
          {profile.has_selfie && <KycDocument userId={agent.id} which="selfie" label="Selfie" />}
        </div>
        {profile.kyc_status === "pending" && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => approve.mutate()} disabled={approve.isPending}>
              <Check /> Approve
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="outline">
                  <X /> Reject
                </Button>
              }
              title={`Reject ${fullName(agent)}?`}
              description="The agent sees your reason and can resubmit."
              confirmLabel="Reject"
              confirmVariant="destructive"
              field={{ label: "What should they fix?", placeholder: "ID photo is blurry; retake in good light", required: true, multiline: true }}
              onConfirm={async (reason) => {
                await api(`/admin/users/${agent.id}/kyc/`, { method: "POST", body: { decision: "reject", reason } });
                toast.success("Rejected. The agent has been notified.");
                onDone();
              }}
            />
          </div>
        )}
        {profile.kyc_status === "rejected" && (
          <p className="text-sm text-muted-foreground">Reason given: {profile.kyc_rejection_reason}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AgentsPage() {
  const client = useQueryClient();
  const [status, setStatus] = useState<KycStatus>("pending");
  const [page, setPage] = useState(1);
  const key = ["agents", status, page];
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: key,
    queryFn: () => api<Page<AdminUser>>(`/admin/users/${qs({ user_type: "agent", kyc_status: status, page })}`),
  });

  const refresh = () => {
    client.invalidateQueries({ queryKey: ["agents"] });
    client.invalidateQueries({ queryKey: ["stats"] });
  };

  return (
    <>
      <PageHeader
        title="KYC review"
        description="Oldest submissions first. Approving lets the agent accept errands immediately."
        actions={
          <NativeSelect
            aria-label="KYC status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as KycStatus);
              setPage(1);
            }}
          >
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="approved">Approved</option>
            <option value="not_submitted">Not submitted</option>
          </NativeSelect>
        }
      />
      {isLoading && <LoadingRows />}
      {error && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.results.length === 0 && (
        <EmptyState title={status === "pending" ? "Queue is clear" : "No agents here"} hint="New submissions appear here automatically." />
      )}
      <div className="space-y-4">
        {data?.results.map((agent) => (
          <ReviewCard key={agent.id} agent={agent} onDone={refresh} />
        ))}
      </div>
      <Pager page={page} data={data} onPage={setPage} />
    </>
  );
}
