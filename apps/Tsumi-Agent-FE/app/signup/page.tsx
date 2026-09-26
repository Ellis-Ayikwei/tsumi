"use client";

import { AuthScreen } from "@tsumi/ui/components/auth-screen";

import { client } from "@/lib/client";

export default function Page() {
  return (
    <AuthScreen
      client={client}
      mode="signup"
      userType="agent"
      heading="Earn with Tsumi"
      tagline="Run errands in your area and get paid safely to your MoMo."
      wrongTypeMessage="This is the Tsumi Runner app. Customers use the Tsumi app to post errands."
    />
  );
}
