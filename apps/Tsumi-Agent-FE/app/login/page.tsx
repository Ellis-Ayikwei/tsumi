import { AuthScreen } from "@tsumi/ui/components/auth-screen";

import { client } from "@/lib/client";

export default function Page() {
  return (
    <AuthScreen
      client={client}
      mode="login"
      userType="agent"
      heading="Ready to run?"
      tagline="Sign in to see open errands near you."
      wrongTypeMessage="This is the Tsumi Agent app. Customers use the Tsumi app to post errands."
    />
  );
}
