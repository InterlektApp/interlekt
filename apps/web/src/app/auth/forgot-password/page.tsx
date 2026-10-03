import { Placeholder } from "@/components/placeholder";

export default function Page() {
  return (
    <Placeholder
      title="Reset your password"
      description="Password reset arrives with the backend (AUTH-006). For the MVP, contact support and we'll sort you out."
      ctaHref="/auth/login"
      ctaLabel="Back to login"
    />
  );
}
