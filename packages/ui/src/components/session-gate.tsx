"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import type { ApiClient } from "../lib/api";
import type { SessionUser, UserType } from "../lib/types";
import { Button } from "./button";

const SessionContext = createContext<SessionUser | null>(null);

/** The signed-in user. Only valid inside <SessionGate>. */
export function useSession(): SessionUser {
  const user = useContext(SessionContext);
  if (!user) throw new Error("useSession must be used inside <SessionGate>");
  return user;
}

/**
 * Renders children only for a signed-in user of `requiredType`. The stored
 * token is not trusted on its own: the user is re-fetched from the API.
 */
export function SessionGate({
  client,
  requiredType,
  wrongTypeMessage,
  children,
}: {
  client: ApiClient;
  requiredType: UserType;
  wrongTypeMessage: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const present = Boolean(client.tokens.access());
    setHasToken(present);
    if (!present) router.replace("/login");
  }, [client, router]);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => client.api<SessionUser>("/auth/user/"),
    enabled: hasToken === true,
    retry: false,
  });

  useEffect(() => {
    if (me.isError) router.replace("/login");
  }, [me.isError, router]);

  if (!me.data) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" aria-label="Loading" />
      </div>
    );
  }

  if (me.data.user_type !== requiredType) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold">Wrong app for this account</p>
        <p className="text-sm text-muted-foreground">{wrongTypeMessage}</p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={async () => {
            await client.logout();
            router.replace("/login");
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }

  return <SessionContext.Provider value={me.data}>{children}</SessionContext.Provider>;
}
