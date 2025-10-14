import KYCReviewClient from "./components/KYCReviewClient";

export default function KYCReviewPage({ params }: { params: any }) {
  return <KYCReviewClient id={params.id} />;
}