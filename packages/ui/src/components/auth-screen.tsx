"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ApiError, type ApiClient } from "../lib/api";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

/** Login and sign-up screen shared by the customer and agent apps. */
export function AuthScreen({
  client,
  mode,
  userType,
  heading,
  tagline,
  wrongTypeMessage,
}: {
  client: ApiClient;
  mode: "login" | "signup";
  userType: "customer" | "agent";
  heading: string;
  tagline: string;
  wrongTypeMessage: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone_number: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user =
        mode === "login"
          ? await client.login(form.email, form.password)
          : await client.register({ ...form, phone_number: form.phone_number || undefined, user_type: userType });
      if (user.user_type !== userType) {
        await client.logout();
        setError(wrongTypeMessage);
        return;
      }
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const field = (id: keyof typeof form, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={form[id]} onChange={set(id)} className="h-12 rounded-xl" {...props} />
    </div>
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pb-safe pt-safe">
      <div className="flex flex-1 flex-col justify-end pb-8 pt-16">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
          T
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{heading}</h1>
        <p className="mt-2 text-muted-foreground">{tagline}</p>
      </div>
      <form onSubmit={submit} className="grid gap-4 pb-8">
        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-3">
            {field("first_name", "First name", { required: true, autoComplete: "given-name" })}
            {field("last_name", "Last name", { required: true, autoComplete: "family-name" })}
          </div>
        )}
        {field("email", "Email", { type: "email", required: true, autoComplete: "username" })}
        {mode === "signup" &&
          field("phone_number", "Phone", {
            type: "tel",
            placeholder: "024 123 4567",
            autoComplete: "tel",
            required: userType === "agent",
          })}
        {field("password", "Password", {
          type: "password",
          required: true,
          minLength: mode === "signup" ? 8 : undefined,
          autoComplete: mode === "signup" ? "new-password" : "current-password",
        })}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="xl" disabled={busy}>
          {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              New here?{" "}
              <Link href="/signup" className="font-medium text-foreground underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Have an account?{" "}
              <Link href="/login" className="font-medium text-foreground underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
