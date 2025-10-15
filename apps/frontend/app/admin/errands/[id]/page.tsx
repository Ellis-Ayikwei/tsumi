import ErrandDetailClient from "./components/ErrandDetailClient";

export default async function AdminErrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ErrandDetailClient id={id} />;
}