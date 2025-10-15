import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request an Errand",
  description: "Create a new errand request with pickup and delivery details.",
  alternates: { canonical: "/request-errand" },
};

export default function RequestErrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

