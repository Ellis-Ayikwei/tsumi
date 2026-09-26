"use client";

import { useQuery } from "@tanstack/react-query";
import { Briefcase, Route, User, Wallet } from "lucide-react";

import { MobileShell } from "@tsumi/ui/components/mobile-shell";
import { SessionGate } from "@tsumi/ui/components/session-gate";
import type { Errand, Page } from "@tsumi/ui/lib/types";

import { api, client } from "@/lib/client";
import { ACTIVE_STATUSES } from "@/lib/jobs";

function Shell({ children }: { children: React.ReactNode }) {
  const active = useQuery({
    queryKey: ["jobs", "mine", "active-count"],
    queryFn: () => api<Page<Errand>>(`/errands/?scope=mine&status=${ACTIVE_STATUSES}&page_size=1`),
    refetchInterval: 30_000,
  });
  return (
    <MobileShell
      nav={[
        { href: "/", label: "Jobs", Icon: Briefcase },
        { href: "/active", label: "Active", Icon: Route, badge: active.data?.count },
        { href: "/earnings", label: "Earnings", Icon: Wallet },
        { href: "/profile", label: "Profile", Icon: User },
      ]}
    >
      {children}
    </MobileShell>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate
      client={client}
      requiredType="agent"
      wrongTypeMessage="This is the Tsumi Agent app. Customers use the Tsumi app to post errands."
    >
      <Shell>{children}</Shell>
    </SessionGate>
  );
}
