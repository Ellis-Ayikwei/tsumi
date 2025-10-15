import KYCReviewClient from "./components/KYCReviewClient";

export default async function KYCReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <KYCReviewClient id={id} />;
}