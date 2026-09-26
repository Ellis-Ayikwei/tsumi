"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Bell, ChevronRight, LifeBuoy, LogOut, Pencil, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@tsumi/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@tsumi/ui/components/drawer";
import { Input } from "@tsumi/ui/components/input";
import { Label } from "@tsumi/ui/components/label";
import { AppHeader } from "@tsumi/ui/components/mobile-shell";
import { useSession } from "@tsumi/ui/components/session-gate";
import { ApiError } from "@tsumi/ui/lib/api";
import type { SessionUser } from "@tsumi/ui/lib/types";

import { api, client } from "@/lib/client";

function EditProfileSheet({ user }: { user: SessionUser }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const updated = await api<SessionUser>("/auth/user/", { method: "PATCH", body: form });
      queryClient.setQueryData(["me"], updated);
      toast.success("Profile updated.");
      setOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <Pencil /> Edit
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit profile</DrawerTitle>
        </DrawerHeader>
        <div className="grid gap-3 px-5 py-2">
          {(
            [
              ["first_name", "First name", "text"],
              ["last_name", "Last name", "text"],
              ["phone_number", "Phone (runners call you on this)", "tel"],
            ] as const
          ).map(([key, label, type]) => (
            <div key={key} className="grid gap-1.5">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type={type}
                className="h-12 rounded-xl"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
        <DrawerFooter>
          <Button size="xl" onClick={save} disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function ProfilePage() {
  const user = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const links = [
    { href: "/wallet", label: "Wallet", Icon: Wallet },
    { href: "/notifications", label: "Notifications", Icon: Bell },
    { href: "mailto:support@tsumi.app", label: "Help and support", Icon: LifeBuoy },
  ];

  return (
    <>
      <AppHeader large title="Profile" />
      <div className="space-y-5 px-4">
        <section className="flex items-center gap-4 rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
            {user.first_name.slice(0, 1)}
            {user.last_name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold">
              {user.first_name} {user.last_name}
            </p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">{user.phone_number ?? "Add a phone number"}</p>
          </div>
          <EditProfileSheet user={user} />
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
