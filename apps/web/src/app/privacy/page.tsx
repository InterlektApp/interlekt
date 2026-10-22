import Link from "next/link";
import { PublicShell } from "@/components/public/public-shell";
import { LegalParagraph, LegalProse, LegalSection, LegalUpdated } from "@/components/public/legal-prose";
import { Alert } from "@/components/ui/feedback";

/**
 * A18 — Privacy Policy.
 *
 * Describes what the product actually stores today: the account fields, the
 * activity that comes with using a community, and the session tokens that
 * live in the browser's local storage rather than in cookies.
 */

const EFFECTIVE_DATE = "October 2026";

export default function PrivacyPage() {
  return (
    <PublicShell active="about">
      <LegalProse>
        <h1 className="h1" style={{ marginBottom: 12 }}>
          Privacy Policy
        </h1>
        <LegalUpdated date={EFFECTIVE_DATE} />

        <Alert variant="info" title="Quick summary" className="mb-8">
          <ul className="flex flex-col" style={{ gap: 8, margin: 0, paddingLeft: 20 }}>
            <li>We collect the account details you give us and the activity that comes with learning.</li>
            <li>Your session token is kept in your browser&apos;s local storage. We do not use cookies to sign you in.</li>
            <li>We do not run advertising trackers, third-party analytics or marketing pixels.</li>
            <li>We do not sell your data, and we do not share it with advertisers.</li>
            <li>You can ask what we hold, or ask us to delete your account, by emailing privacy@interlekt.com.</li>
          </ul>
        </Alert>

        <LegalSection title="1. Information we collect">
          <LegalParagraph>
            <strong>Account information.</strong> When you register we collect your email address, the
            display name you choose, a password (stored hashed, never in readable form), whether you are a
            learner or a creator, and the date your account was created. If you set a profile picture or
            write a bio, we store the image address and the text you wrote.
          </LegalParagraph>
          <LegalParagraph>
            <strong>Learning activity.</strong> When you join a community we record the enrolment and
            when it happened. When you complete a lesson we record that completion against your account.
            Progress, course completion figures and community memberships are all stored so that your
            dashboard and classroom keep working across devices.
          </LegalParagraph>
          <LegalParagraph>
            <strong>What you write.</strong> Posts and replies you make in a community feed, and reviews
            you leave for a community, are stored with your display name attached. If a creator publishes a
            course, the lessons and modules they create are stored against their account.
          </LegalParagraph>
          <LegalParagraph>
            <strong>Session tokens.</strong> When you sign in, your browser stores an access token and a
            refresh token in its local storage so you stay signed in. These are stored on your device,
            not on our servers in a form anyone else can read, and they are removed when you sign out.
          </LegalParagraph>
          <LegalParagraph>
            <strong>Technical information.</strong> Our hosting provider may record standard request
            information such as IP address, user agent and timestamps in server logs, for security and
            reliability purposes.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="2. How we use your information">
          <LegalParagraph>
            We use your information to run the product you are using: signing you in, showing your
            dashboard, delivering lessons, displaying the community feed, attributing posts and reviews,
            and letting creators see aggregate information about their own community.
          </LegalParagraph>
          <LegalParagraph>
            We also use it to keep the service safe — investigating reports, enforcing these terms,
            preventing fraud, and understanding which parts of the product are used so we can improve them.
          </LegalParagraph>
          <LegalParagraph>
            We do not use your content to train machine-learning models, and we do not build advertising
            profiles.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="3. How we share information">
          <LegalParagraph>
            We share information with the people you are already sharing it with: members of a community
            can see your display name, avatar, posts and replies in that community, and your enrolment
            makes you visible to that community&apos;s creator.
          </LegalParagraph>
          <LegalParagraph>
            We share information with service providers that help us operate the platform — hosting,
            email delivery and error monitoring — but only the information they need to do their job,
            and under obligations to keep it confidential.
          </LegalParagraph>
          <LegalParagraph>
            We will disclose information if we are legally required to, or if we need to do so to protect
            the safety of the platform or the people using it. We do not sell your personal information
            to anyone, for any price.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="4. Your rights">
          <LegalParagraph>
            You can see and change your display name, avatar and bio from your profile, and you can leave
            any community you have joined. Your lesson progress is yours; asking us to delete it means
            deleting it.
          </LegalParagraph>
          <LegalParagraph>
            You can also ask us what we hold about you, ask for a copy of it, ask us to correct it, or ask
            us to delete your account entirely. Email{" "}
            <a href="mailto:privacy@interlekt.com" style={{ color: "var(--accent)" }}>
              privacy@interlekt.com
            </a>{" "}
            and we will deal with it. There is no self-service export or delete button in the product
            today, so please do contact us and we will do it for you.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="5. Data retention">
          <LegalParagraph>
            We keep account information for as long as your account exists. Learning records — enrolments,
            lesson completions, posts and reviews — are kept for as long as your account exists and are
            removed when you ask us to delete it, except where we are legally required to keep them.
          </LegalParagraph>
          <LegalParagraph>
            We keep server logs for a limited period for security and reliability, and then delete them.
            Where we anonymise information for analysis, we do so before it is used.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="6. Security">
          <LegalParagraph>
            Passwords are hashed and never stored or transmitted in readable form. Traffic is served over
            HTTPS. Access to the production databases is limited to the people who need it and is logged.
            Session tokens can be revoked server-side by signing out, which ends the session on every
            device.
          </LegalParagraph>
          <LegalParagraph>
            No system is perfect. If you think an account has been compromised, change your password and
            tell us at{" "}
            <a href="mailto:security@interlekt.com" style={{ color: "var(--accent)" }}>
              security@interlekt.com
            </a>
            .
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="7. Children&apos;s privacy">
          <LegalParagraph>
            Interlekt is not directed at children, and you must be at least 18 to hold an account. We do
            knowingly collect information from children. If you believe a child has created an account,
            tell us and we will remove it.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="8. International users">
          <LegalParagraph>
            Interlekt is built and operated from Nigeria. Information you provide may be processed on
            servers outside your own country, including in regions where the laws differ from Nigerian
            law. If that matters to you, email privacy@interlekt.com and we will talk about it.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="9. Cookies and local storage">
          <LegalParagraph>
            Interlekt does not use cookies to sign you in, and it runs no advertising or third-party
            analytics trackers. Your session token is held in your browser&apos;s local storage, which
            never leaves your device except as the bearer token in an API request. See the{" "}
            <Link href="/cookies" style={{ color: "var(--accent)" }}>
              Cookie Policy
            </Link>{" "}
            for the full list of what is stored on your device.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="10. Changes to this policy">
          <LegalParagraph>
            If we change this policy we will update the date at the top of the page and, where the change
            materially affects you, let you know by email or by a notice in the product.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="11. Contact">
          <LegalParagraph>
            Questions, requests and complaints about privacy go to{" "}
            <a href="mailto:privacy@interlekt.com" style={{ color: "var(--accent)" }}>
              privacy@interlekt.com
            </a>
            . We aim to respond within one working day.
          </LegalParagraph>
        </LegalSection>
      </LegalProse>
    </PublicShell>
  );
}
