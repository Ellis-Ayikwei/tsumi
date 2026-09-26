"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Bell, ChevronRight, LifeBuoy, LogOut, ShieldCheck, Star, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@tsumi/ui/components/button";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { useSession } from "@tsumi/ui/components/session-gate";
import { StatusBadge } from "@tsumi/ui/components/status-badge";
import { formatRating, humanize } from "@tsumi/ui/lib/format";
import type { AgentMe, UserBadge } from "@tsumi/ui/lib/types";

import { api, client } from "@/lib/client";

export default function ProfilePage() {
  const user = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const me = useQuery({ queryKey: ["agent-me"], queryFn: () => api<AgentMe>("/agents/me/") });
  const badges = useQuery({
    queryKey: ["badges", user.id],
    queryFn: () => api<UserBadge[]>(`/trust/users/${user.id}/badges/`),
  });
  const stats = me.data?.stats;

  const links = [
    { href: "/verify", label: "Identity verification", Icon: ShieldCheck },
    { href: "/earnings", label: "Earnings and withdrawals", Icon: Wallet },
    { href: "/notifications", label: "Notifications", Icon: Bell },
    { href: "mailto:agents@tsumi.app", label: "Runner support", Icon: LifeBuoy },
  ];

  return (
    <>
      <AppHeader large title="Profile" />
      <div className="space-y-5 px-4">
        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {user.first_name.slice(0, 1)}
              {user.last_name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold">
                {user.first_name} {user.last_name}
              </p>
              <p className="truncate text-sm text-muted-foreground">{user.phone_number ?? user.email}</p>
              {me.data && <StatusBadge status={me.data.kyc_status} />}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 divide-x rounded-2xl bg-muted/60 py-3 text-center">
            <div>
              <p className="text-xl font-bold tabular-nums">{stats?.completed_errands ?? "-"}</p>
              <p className="text-xs text-muted-foreground">Jobs done</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 text-xl font-bold tabular-nums">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                {formatRating(stats?.avg_rating_centi)}
              </p>
              <p className="text-xs text-muted-foreground">{stats?.ratings_count ?? 0} ratings</p>
            </div>
            <div>
              <p className="text-xl font-bold">{me.data ? humanize(me.data.vehicle_type) : "-"}</p>
              <p className="text-xs text-muted-foreground">Vehicle</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Trust badges</h2>
          {badges.data?.length ? (
            <div className="flex flex-wrap gap-2">
              {badges.data.map(({ badge }) => (
                <span key={badge.code} title={badge.description} className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm">
                  <BadgeCheck className="h-4 w-4 text-brand" aria-hidden /> {badge.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Complete jobs with great ratings to earn badges customers trust.</p>
          )}
        </section>

        <section className="divide-y rounded-3xl border bg-card shadow-sm">
          {links.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-5 py-4">
              <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
              <span className="flex-1">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          ))}
        </section>

        <Button
          size="xl"
          variant="ghost"
          className="w-full text-destructive"
          onClick={async () => {
            if (me.data?.is_available) {
              await api("/agents/me/", { method: "PATCH", body: { is_available: false } }).catch(() => undefined);
            }
            await client.logout();
            queryClient.clear();
            router.replace("/login");
          }}
        >
          <LogOut /> Sign out
        </Button>
      </div>
    </>
  );
}
