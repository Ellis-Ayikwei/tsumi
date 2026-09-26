"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { ErrorState, LoadingRows } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, ApiError, qs } from "@/lib/api";
import { formatDateTime, formatRating, fullName, humanize } from "@/lib/format";
import { formatGhs, parseGhsToPesewas } from "@/lib/money";
import type { AdminUserDetail, LedgerEntry, Page, TrustBadge } from "@/lib/types";

function AdjustWalletDialog({ user, onDone }: { user: AdminUserDetail; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pesewas = parseGhsToPesewas(amount);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pesewas || !memo.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/admin/users/${user.id}/wallet/adjust/`, {
        method: "POST",
        body: { amount_pesewas: pesewas, memo: memo.trim() },
      });
      toast.success(`${pesewas > 0 ? "Credited" : "Debited"} ${formatGhs(Math.abs(pesewas))}.`);
      setOpen(false);
      setAmount("");
      setMemo("");
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Adjustment failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Adjust balance</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Adjust {fullName(user)}&apos;s wallet</DialogTitle>
            <DialogDescription>
              Current balance {formatGhs(user.balance_pesewas ?? 0)}. The adjustment is permanent and appears in the
              ledger with your name and memo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="adjust-amount">Amount in GHS (negative to debit)</Label>
            <Input id="adjust-amount" inputMode="decimal" placeholder="25.00 or -10" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
            {amount && pesewas === null && <p className="text-sm text-destructive">Enter a number with up to 2 decimals, like 25.50.</p>}
            {pesewas === 0 && <p className="text-sm text-destructive">Enter a non-zero amount.</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="adjust-memo">Memo</Label>
            <Input id="adjust-memo" placeholder="Goodwill credit for late delivery" value={memo} onChange={(e) => setMemo(e.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy || !pesewas || !memo.trim()}>
              {pesewas && pesewas < 0 ? `Debit ${formatGhs(-pesewas)}` : pesewas ? `Credit ${formatGhs(pesewas)}` : "Adjust"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = useQueryClient();
  const user = useQuery({ queryKey: ["user", id], queryFn: () => api<AdminUserDetail>(`/admin/users/${id}/`) });
  const badges = useQuery({ queryKey: ["badges"], queryFn: () => api<TrustBadge[]>("/admin/badges/") });
  const ledger = useQuery({
    queryKey: ["ledger", "user", id],
    queryFn: () => api<Page<LedgerEntry>>(`/admin/ledger/${qs({ user: id, page_size: 10 })}`),
  });

  const refresh = () => {
    client.invalidateQueries({ queryKey: ["user", id] });
    client.invalidateQueries({ queryKey: ["ledger", "user", id] });
    client.invalidateQueries({ queryKey: ["users"] });
  };

  if (user.isLoading) return <LoadingRows />;
  if (user.error || !user.data) return <ErrorState error={user.error} onRetry={() => user.refetch()} />;
  const u = user.data;
  const profile = u.agent_profile;

  return (
    <>
      <PageHeader
        title={fullName(u)}
        description={`${humanize(u.user_type)} · joined ${formatDateTime(u.date_joined)}`}
        actions={
          <>
            <StatusBadge status={u.is_active ? "active" : "suspended"} />
            <Button asChild variant="outline" size="sm">
              <Link href={`/errands?user=${u.id}`}>Errands</Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant={u.is_active ? "destructive" : "default"} size="sm">
                  {u.is_active ? "Suspend" : "Reactivate"}
                </Button>
              }
              title={u.is_active ? `Suspend ${fullName(u)}?` : `Reactivate ${fullName(u)}?`}
              description={
                u.is_active
                  ? "They are signed out on their next request and cannot log in. Their wallet and errands are kept."
                  : "They can log in again immediately."
              }
              confirmLabel={u.is_active ? "Suspend" : "Reactivate"}
              confirmVariant={u.is_active ? "destructive" : "default"}
              onConfirm={async () => {
                await api(`/admin/users/${u.id}/${u.is_active ? "suspend" : "reactivate"}/`, { method: "POST" });
                toast.success(u.is_active ? "Account suspended." : "Account reactivated.");
                refresh();
              }}
            />
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div>{u.email}</div>
            <div>{u.phone_number ?? "No phone"}</div>
            <div className="text-muted-foreground">Last login {formatDateTime(u.last_login)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Wallet</CardTitle>
            <AdjustWalletDialog user={u} onDone={refresh} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{formatGhs(u.balance_pesewas ?? 0)}</div>
          </CardContent>
        </Card>
        {profile && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Runner</CardTitle>
              <StatusBadge status={profile.kyc_status} />
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>{u.stats?.completed_errands ?? 0} completed · rating {formatRating(u.stats?.avg_rating_centi)} ({u.stats?.ratings_count ?? 0})</div>
              <div>{humanize(profile.vehicle_type)} · {profile.is_available ? "available" : "offline"}</div>
              {profile.kyc_status === "pending" && (
                <Link href="/agents" className="underline">Review KYC</Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {profile && (
        <Card className="mt-4">
          <CardHeader><CardTitle className="text-base">Trust badges</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {badges.data?.map((badge) => {
              const has = u.badges.includes(badge.code);
              if (!badge.is_manual) {
                return has ? <Badge key={badge.code} variant="success">{badge.name}</Badge> : null;
              }
              return (
                <Button
                  key={badge.code}
                  size="sm"
                  variant={has ? "default" : "outline"}
                  title={badge.description}
                  onClick={async () => {
                    try {
                      await api(`/admin/users/${u.id}/badges/${badge.code}/`, { method: has ? "DELETE" : "POST" });
                      toast.success(has ? `Removed ${badge.name}.` : `Awarded ${badge.name}.`);
                      refresh();
                    } catch (err) {
                      toast.error(err instanceof ApiError ? err.message : "Could not update badge.");
                    }
                  }}
                >
                  {has ? "✓ " : "+ "}
                  {badge.name}
                </Button>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Recent wallet activity</CardTitle>
          <Link href={`/ledger?user=${u.id}`} className="text-sm underline">Full ledger</Link>
        </CardHeader>
        <CardContent>
          {ledger.data && ledger.data.results.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
          {ledger.data && ledger.data.results.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Memo</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.data.results.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="whitespace-nowrap">{formatDateTime(line.created_at)}</TableCell>
                    <TableCell>{humanize(line.entry_type)}</TableCell>
                    <TableCell className="text-muted-foreground">{line.memo}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatGhs(line.amount_pesewas)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatGhs(line.balance_after_pesewas)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
