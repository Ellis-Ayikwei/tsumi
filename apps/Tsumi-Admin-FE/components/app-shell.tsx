"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Banknote,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { api, logout, tokens } from "@/lib/api";
import type { AdminStats, SessionUser } from "@/lib/types";
import { cn } from "@/lib/utils";

type CountKey = "kyc" | "disputes" | "withdrawals";

const NAV: { href: string; label: string; Icon: typeof Users; count?: CountKey }[] = [
  { href: "/", label: "Overview", Icon: LayoutDashboard },
  { href: "/agents", label: "KYC review", Icon: ShieldCheck, count: "kyc" },
  { href: "/errands", label: "Errands", Icon: Package },
  { href: "/disputes", label: "Disputes", Icon: AlertTriangle, count: "disputes" },
  { href: "/withdrawals", label: "Withdrawals", Icon: Banknote, count: "withdrawals" },
  { href: "/users", label: "Users", Icon: Users },
  { href: "/service-areas", label: "Service areas", Icon: MapIcon },
  { href: "/ledger", label: "Ledger", Icon: BookOpen },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const present = Boolean(tokens.access());
    setHasToken(present);
    if (!present) router.replace("/login");
  }, [router]);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => api<SessionUser>("/auth/user/"),
    enabled: hasToken === true,
  });
  // Queue counts in the sidebar, so work waiting elsewhere is visible from every page.
  const stats = useQuery({
    queryKey: ["stats"],
    queryFn: () => api<AdminStats>("/admin/stats/"),
    enabled: me.data?.is_staff === true,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (me.data && !me.data.is_staff) {
      tokens.clear();
      router.replace("/login");
    }
  }, [me.data, router]);

  if (!hasToken || !me.data?.is_staff) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading...</div>;
  }

  const counts: Record<CountKey, number> = {
    kyc: stats.data?.agents_pending_kyc ?? 0,
    disputes: stats.data?.open_disputes ?? 0,
    withdrawals: stats.data?.pending_withdrawals.count ?? 0,
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b bg-muted/30 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Tsumi <span className="font-normal text-muted-foreground">Admin</span>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible">
          {NAV.map(({ href, label, Icon, count }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                isActive(href) && "bg-accent font-medium"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span className="flex-1">{label}</span>
              {count && counts[count] > 0 && (
                <span className="rounded-full bg-primary px-2 text-xs text-primary-foreground">{counts[count]}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="hidden px-4 py-4 text-xs text-muted-foreground md:absolute md:bottom-0 md:block md:w-60">
          <p className="truncate">{me.data.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 px-0"
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            <LogOut /> Log out
          </Button>
        </div>
      </aside>
      <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
