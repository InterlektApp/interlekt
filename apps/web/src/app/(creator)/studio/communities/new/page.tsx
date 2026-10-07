import { Placeholder } from "@/components/placeholder";

export default function Page() {
  return (
    <Placeholder
      title="New Community"
      description="Title, description, up to 5 categories, cover image, and price (NGN, one-time or free). Wires to POST /communities once the creator onboarding flow lands."
      variant="creator"
      ctaHref="/studio"
      ctaLabel="Back to studio"
    />
  );
}
