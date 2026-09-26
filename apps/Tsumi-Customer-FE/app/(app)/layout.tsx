"use client";

import { useQuery } from "@tanstack/react-query";
import { Home, ListChecks, User, Wallet } from "lucide-react";

import { MobileShell } from "@tsumi/ui/components/mobile-shell";
import { SessionGate } from "@tsumi/ui/components/session-gate";
import type { Errand, Page } from "@tsumi/ui/lib/types";

import { api, client } from "@/lib/client";

function Shell({ children }: { children: React.ReactNode }) {
  // Errands waiting on the customer's confirmation show as a badge on the tab.
  const toConfirm = useQuery({
    queryKey: ["errands", "delivered"],
    queryFn: () => api<Page<Errand>>("/errands/?status=delivered&page_size=1"),
    refetchInterval: 30_000,
  });
  return (
    <MobileShell
      nav={[
        { href: "/", label: "Home", Icon: Home },
        { href: "/errands", label: "Errands", Icon: ListChecks, badge: toConfirm.data?.count },
        { href: "/wallet", label: "Wallet", Icon: Wallet },
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
      requiredType="customer"
      wrongTypeMessage="This is the customer app. Runners use the Tsumi Runner app."
    >
      <Shell>{children}</Shell>
    </SessionGate>
  );
}
