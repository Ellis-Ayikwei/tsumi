import { AuthScreen } from "@tsumi/ui/components/auth-screen";

import { client } from "@/lib/client";

export default function SignupPage() {
  return (
    <AuthScreen
      client={client}
      mode="signup"
      userType="customer"
      heading="Send me. Safely."
      tagline="Verified runners for your errands, with your money held safely until it's done."
      wrongTypeMessage="This is the customer app. Agents sign in to the Tsumi Agent app."
    />
  );
}
