"use client";

import { NotificationsView } from "@tsumi/ui/components/notifications-view";

import { client } from "@/lib/client";

export default function NotificationsPage() {
  return <NotificationsView client={client} errandHref="/errands" />;
}
