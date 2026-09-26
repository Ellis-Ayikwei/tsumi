import { createApiClient } from "@tsumi/ui/lib/api";

export const client = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  storagePrefix: "tsumi_agent",
});

export const { api } = client;
