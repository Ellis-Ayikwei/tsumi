import { AuthScreen } from "@tsumi/ui/components/auth-screen";

import { client } from "@/lib/client";

export default function LoginPage() {
  return (
    <AuthScreen
      client={client}
      mode="login"
      userType="customer"
      heading="Welcome back"
      tagline="Send someone you can trust."
      wrongTypeMessage="This is the customer app. Agents sign in to the Tsumi Agent app."
    />
  );
}
