import Link from "next/link";
import { PublicShell } from "@/components/public/public-shell";
import { LegalParagraph, LegalProse, LegalSection, LegalUpdated } from "@/components/public/legal-prose";
import { Alert } from "@/components/ui/feedback";

/**
 * A17 — Terms of Service.
 *
 * Pure static legal copy, dated. The payments and refunds sections describe
 * the policy that will apply when paid memberships are switched on; they
 * say plainly that no payment is taken today.
 */

const EFFECTIVE_DATE = "October 2026";

export default function TermsPage() {
  return (
    <PublicShell active="about">
      <LegalProse>
        <h1 className="h1" style={{ marginBottom: 12 }}>
          Terms of Service
        </h1>
        <LegalUpdated date={EFFECTIVE_DATE} />

        <Alert variant="info" title="Quick summary" className="mb-8">
          <ul className="flex flex-col" style={{ gap: 8, margin: 0, paddingLeft: 20 }}>
            <li>You need an account to join a community, and you are responsible for what happens under it.</li>
            <li>Creators keep ownership of the material they publish and grant you a licence to learn from it.</li>
            <li>Browsing, joining free communities and using the classroom are free. Paid memberships are not switched on yet.</li>
            <li>Be decent. Harassment, spam and fraud get accounts suspended.</li>
          </ul>
        </Alert>

        <LegalSection title="1. Acceptance of terms">
          <LegalParagraph>
            By creating an account or using Interlekt you agree to these Terms of Service, our{" "}
            <Link href="/privacy" style={{ color: "var(--accent)" }}>
              Privacy Policy
            </Link>
            , our{" "}
            <Link href="/cookies" style={{ color: "var(--accent)" }}>
              Cookie Policy
            </Link>{" "}
            and our{" "}
            <Link href="/refunds" style={{ color: "var(--accent)" }}>
              Refund Policy
            </Link>
            . If you do not agree with them, do not create an account.
          </LegalParagraph>
          <LegalParagraph>
            Interlekt is operated from Nigeria. These terms are written in plain English; if you need them
            in another language, email legal@interlekt.com and we will do our best to help.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="2. Your account">
          <LegalParagraph>
            You must be at least 18 years old to hold an account, or the age of majority where you live.
            You are responsible for keeping your password confidential and for everything that happens under
            your account, including anything a browser extension or an automated script does with it.
          </LegalParagraph>
          <LegalParagraph>
            You can choose to sign up as a learner or as a creator. A creator account additionally requires
            you to complete creator verification before you can publish a community. You can change the
            name and picture shown on your profile at any time.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="3. Use of the platform">
          <LegalParagraph>
            You may browse the public directory, join communities you are eligible for, work through
            lessons, take part in community feeds, and — if you are a verified creator — publish and
            manage communities and curricula.
          </LegalParagraph>
          <LegalParagraph>
            You may not scrape, copy or republish the directory or community content at scale; reverse
            engineer the service; interfere with its operation; impersonate another person or business;
            upload malware; or use the service to harass, defraud or harm anyone. We may suspend or
            close an account that does this.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="4. Communities and content">
          <LegalParagraph>
            Creators publish their own courses, modules, lessons, posts and reviews. Once published, that
            material stays available to the members of the community unless the creator removes it or we
            remove it for a good reason — for example a safety report or a legal request.
          </LegalParagraph>
          <LegalParagraph>
            Members are responsible for what they post. Do not post anything unlawful, defamatory,
            confidential or copied from somewhere else without permission. We can remove content and warn
            or close the account that posted it.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="5. Payments">
          <LegalParagraph>
            Interlekt does not currently charge for memberships. Browsing the directory, joining a free
            community and using the classroom all cost nothing, and no payment details are required to
            use the service.
          </LegalParagraph>
          <LegalParagraph>
            When paid memberships are switched on, the price shown on a community page will be the amount
            charged for that community, it will be quoted in naira, and each creator will set their own
            price. Payment will be handled by a regulated payment provider; Interlekt will not store your
            card details. The full billing model, the creator revenue share and the payout schedule will
            be published in this section before paid memberships are switched on.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="6. Refunds">
          <LegalParagraph>
            Because no payment is taken today, there is nothing for us to refund. If you have paid a
            creator directly outside Interlekt, that payment is between you and the creator and we cannot
            refund it.
          </LegalParagraph>
          <LegalParagraph>
            When paid memberships are switched on, this policy will set out the refund window, how to ask
            for a refund, how long a refund takes, and the circumstances in which a refund is not
            available. Until then, our{" "}
            <Link href="/refunds" style={{ color: "var(--accent)" }}>
              Refund Policy
            </Link>{" "}
            explains exactly how refunds work today.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="7. Intellectual property">
          <LegalParagraph>
            Creators keep ownership of everything they publish. By publishing on Interlekt they grant us a
            non-exclusive, worldwide licence to host, store, reproduce and display that material for the
            purpose of running the service. That licence ends when the material is removed.
          </LegalParagraph>
          <LegalParagraph>
            You keep ownership of what you post. You grant us the same limited licence so we can show it
            to the members of its community. The Interlekt name, wordmark, logo and the design of the
            product belong to us; please do not use them in a way that suggests we endorse you.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="8. Termination">
          <LegalParagraph>
            You can close your account at any time by emailing support@interlekt.com. Closing your
            account removes your profile and stops you appearing in communities, and it ends your
            sessions. Records we are legally required to keep may be retained in an archive.
          </LegalParagraph>
          <LegalParagraph>
            We may suspend or close an account that breaks these terms, that creates a security risk, or
            that we are required to act on by law. Where we can, we will tell you why and give you a
            chance to put it right.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="9. Disclaimers">
          <LegalParagraph>
            Interlekt is provided as it is. We do not promise that it will be uninterrupted, error-free,
            or that any particular community will continue to run. Learning outcomes depend on the
            creator, the curriculum and how much time you put in — we facilitate the room, we do not
            guarantee the result.
          </LegalParagraph>
          <LegalParagraph>
            Content published by creators and members is their opinion and their work. We do not endorse
            it, and we are not responsible for it.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="10. Limitation of liability">
          <LegalParagraph>
            To the fullest extent the law allows, Interlekt and its team are not liable for indirect or
            consequential loss arising from your use of the service, including lost profits, lost data or
            business interruption. Nothing in these terms excludes liability that cannot lawfully be
            excluded, including liability for fraud.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="11. Changes to these terms">
          <LegalParagraph>
            We may update these terms as the product changes. The date at the top of this page is the
            date the current version took effect. If a change materially affects your rights we will try
            to tell you before it takes effect — by email, or by a notice in the product.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="12. Contact">
          <LegalParagraph>
            Questions about these terms go to{" "}
            <a href="mailto:legal@interlekt.com" style={{ color: "var(--accent)" }}>
              legal@interlekt.com
            </a>
            . For anything about an account or a community, contact{" "}
            <a href="mailto:support@interlekt.com" style={{ color: "var(--accent)" }}>
              support@interlekt.com
            </a>
            .
          </LegalParagraph>
        </LegalSection>
      </LegalProse>
    </PublicShell>
  );
}
