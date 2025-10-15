import DisputeDetailClient from "./components/DisputeDetailClient";

export default async function AdminDisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DisputeDetailClient id={id} />;
}