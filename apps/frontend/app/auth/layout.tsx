import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Tsumi",
    default: "Authentication | Tsumi",
  },
  description: "Sign in or create an account with Tsumi to manage your errands and deliveries.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

