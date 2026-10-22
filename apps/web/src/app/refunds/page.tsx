import Link from "next/link";
import { PublicShell } from "@/components/public/public-shell";
import { LegalParagraph, LegalProse, LegalSection, LegalUpdated } from "@/components/public/legal-prose";
import { Alert } from "@/components/ui/feedback";

/**
 * A20 — Refund Policy.
 *
 * Interlekt does not take payments yet, so there is no self-serve refund
 * flow and no subscription management screen to point people at. The policy
 * says so plainly and explains how to reach a person instead.
 */

const EFFECTIVE_DATE = "October 2026";

export default function RefundsPage() {
  return (
    <PublicShell active="about">
      <LegalProse>
        <h1 className="h1" style={{ marginBottom: 12 }}>
          Refund Policy
        </h1>
        <LegalUpdated date={EFFECTIVE_DATE} />

        <Alert variant="info" title="Quick summary" className="mb-8">
          <ul className="flex flex-col" style={{ gap: 8, margin: 0, paddingLeft: 20 }}>
            <li>Interlekt does not charge for memberships today, so there is nothing for us to refund.</li>
            <li>There is no self-serve refund flow and no subscription management screen, because neither exists yet.</li>
            <li>If you paid a creator directly outside Interlekt, we cannot refund that payment.</li>
            <li>Paid memberships and refunds are switched on together — this policy will be updated before either goes live.</li>
          </ul>
        </Alert>

        <LegalSection title="1. No payments are taken today">
          <LegalParagraph>
            Interlekt currently charges nothing. Browsing the community directory, joining a free community
            and using the classroom are all free, and we never ask for card details. Because no money
            changes hands on the platform, there is no purchase to refund.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="2. There is no self-serve refund flow">
          <LegalParagraph>
            Many platforms let you cancel a subscription and start a refund from a settings page. Interlekt
            does not have that. There is no subscription management screen, no &ldquo;Request refund&rdquo;
            button, and no account settings page where a purchase would appear.
          </LegalParagraph>
          <LegalParagraph>
            The only thing you can do from inside the product today is leave a community. Open{" "}
            <Link href="/my-communities" style={{ color: "var(--accent)" }}>
              My communities
            </Link>
            , find the community, and leave it. That removes the community from your dashboard; it does
            not change any payment, because there is none.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="3. Payments made outside Interlekt">
          <LegalParagraph>
            If you paid a creator directly — by bank transfer, card payment or cash — that arrangement is
            between you and the creator. Interlekt was not involved in the transaction and cannot issue a
            refund for it. Please contact the creator.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="4. How to ask us about a refund">
          <LegalParagraph>
            If you believe you were charged through Interlekt, or you want to know what our position
            would be once payments go live, email{" "}
            <a href="mailto:support@interlekt.com" style={{ color: "var(--accent)" }}>
              support@interlekt.com
            </a>{" "}
            with the community name and the date. A person reads every message — there is no automated
            refund desk, because there is no automated refund desk to build yet.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="5. Processing time">
          <LegalParagraph>
            There is no refund processing to describe today. When paid memberships are switched on, this
            section will state how long a refund takes from the moment it is approved.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="6. Exceptions">
          <LegalParagraph>
            Refund exceptions will apply once payments exist. The rule we intend to follow is the obvious
            one: if you have already worked through the lessons you paid for, that purchase is not
            refundable. Your completed lessons are recorded on your account, so we can see exactly what
            you have worked through.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="7. Creator obligations">
          <LegalParagraph>
            Interlekt does not yet take a fee from creators or pay them on the platform, so there is no
            balance to deduct a refund from. When that model is introduced, this section will set out how
            an approved refund is handled.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="8. Contact">
          <LegalParagraph>
            Refund questions go to{" "}
            <a href="mailto:support@interlekt.com" style={{ color: "var(--accent)" }}>
              support@interlekt.com
            </a>
            . For anything about the legal wording, contact{" "}
            <a href="mailto:legal@interlekt.com" style={{ color: "var(--accent)" }}>
              legal@interlekt.com
            </a>
            . See also our{" "}
            <Link href="/terms" style={{ color: "var(--accent)" }}>
              Terms of Service
            </Link>
            .
          </LegalParagraph>
        </LegalSection>
      </LegalProse>
    </PublicShell>
  );
}
