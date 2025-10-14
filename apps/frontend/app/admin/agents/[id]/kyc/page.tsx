import KYCReviewClient from "./components/KYCReviewClient";

export default function KYCReviewPage({ params }: { params: { id: string } }) {
  return <KYCReviewClient id={params.id} />;
}