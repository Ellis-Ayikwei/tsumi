import AgentDetailClient from "./components/AgentDetailClient";

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AgentDetailClient id={id} />;
}