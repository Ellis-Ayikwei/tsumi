"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import type { ApiClient } from "../lib/api";
import { formatDateTime } from "../lib/format";
import type { NotificationPage } from "../lib/types";
import { cn } from "../lib/utils";
import { AppHeader } from "./mobile-shell";
import { EmptyState, ErrorState, LoadingList } from "./states";

/** Inbox page body. Opening it marks everything read; unread items stay highlighted for this visit. */
export function NotificationsView({ client, errandHref }: { client: ApiClient; errandHref: string }) {
  const queryClient = useQueryClient();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => client.api<NotificationPage>("/notifications/"),
  });
  const { mutate: markAllRead } = useMutation({
    mutationFn: () => client.api("/notifications/read-all/", { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] }),
  });

  const hasUnread = Boolean(data?.unread_count);
  useEffect(() => {
    if (hasUnread) markAllRead();
  }, [hasUnread, markAllRead]);

  return (
    <>
      <AppHeader back title="Notifications" />
      <div className="space-y-2 px-4">
        {isLoading && <LoadingList />}
        {error && <ErrorState error={error} onRetry={() => refetch()} />}
        {data?.results.length === 0 && (
          <EmptyState title="You're all caught up" icon={<Bell className="h-8 w-8 text-muted-foreground" />} />
        )}
        {data?.results.map((n) => {
          const body = (
            <div className={cn("rounded-2xl border p-4", !n.read_at && "border-primary/30 bg-accent")}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{n.title}</p>
                {!n.read_at && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
              </div>
              {n.body && <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>}
              <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(n.created_at)}</p>
            </div>
          );
          return n.errand ? (
            <Link key={n.id} href={`${errandHref}/${n.errand}`} className="block">
              {body}
            </Link>
          ) : (
            <div key={n.id}>{body}</div>
          );
        })}
      </div>
    </>
  );
}
