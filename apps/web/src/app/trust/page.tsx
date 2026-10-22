import Link from "next/link";
import { PublicShell } from "@/components/public/public-shell";
import { LegalProse } from "@/components/public/legal-prose";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TableWrap,
} from "@/components/ui/data-display";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";

/**
 * A21 — Trust & safety.
 *
 * The verification badge described here is real: `creator.isVerified` is
 * returned by the API and drives the teal check on creator profiles and
 * community pages. There is no in-product reporting form yet, so reports
 * are handled by email.
 */

const EFFECTIVE_DATE = "October 2026";

const COMMITMENTS = [
  {
    title: "Real identity verification",
    text: "Every creator account is checked before it can publish. The teal check on a creator's profile and on their communities means a person reviewed identity documents and proof of work.",
  },
  {
    title: "Working professionals only",
    text: "To be verified you have to be doing the work you teach. We look at your role, your employer or clients, and the communities you have already built.",
  },
  {
    title: "Naira-native transparency",
    text: "Prices are set and shown in naira in full, before anyone commits. No dollar pricing, no hidden fees, no currency conversion games.",
  },
  {
    title: "Content moderation",
    text: "We remove content and close accounts that break the rules, and we tell the community what we found when it affects them.",
  },
];

const VERIFICATION_CHECKS = [
  {
    title: "Identity",
    text: "A government-issued identity document is checked against the account's display name and email address.",
  },
  {
    title: "Proof of work",
    text: "Evidence that you currently work in the field you teach — an employer, a contract, a portfolio, or published work.",
  },
  {
    title: "Community review",
    text: "A person on the Interlekt team reads your profile and your planned curriculum before the verification check is granted.",
  },
  {
    title: "Ongoing monitoring",
    text: "Verification can be reviewed again. If a creator stops working in the field they teach, we ask them to update or remove the badge.",
  },
];

const SEVERITIES = [
  {
    severity: "Critical",
    examples: "Fraud, payment or identity theft, threats of violence, sexual content involving minors.",
    response: "1 hour",
  },
  {
    severity: "High",
    examples: "Harassment, doxxing, scams, impersonation of a verified creator or a company.",
    response: "4 hours",
  },
  {
    severity: "Medium",
    examples: "Spam, undisclosed promotion, off-topic or abusive replies in a community feed.",
    response: "24 hours",
  },
  {
    severity: "Low",
    examples: "Incorrect information, misleading descriptions, minor conduct issues.",
    response: "72 hours",
  },
];

const NOT_ALLOWED = [
  {
    title: "Harassment and hate",
    text: "Attacking someone for who they are, their gender, their religion, their region, their disability or their language is not allowed, in a feed or in a lesson.",
  },
  {
    title: "Fraud and impersonation",
    text: "Pretending to be somebody else, presenting a qualification you do not hold, or running a scam in a community feed gets the account closed.",
  },
  {
    title: "Undisclosed promotion",
    text: "Selling a product, a service or a course inside a community feed without saying so is not allowed. If you are a creator, use the tools we give you.",
  },
  {
    title: "Pirated and stolen material",
    text: "Uploading material you do not own, or that belongs to someone else, is not allowed — including when it is paid material from another creator.",
  },
];

export default function TrustPage() {
  return (
    <PublicShell active="about">
      <LegalProse>
        <h1 className="h1" style={{ marginBottom: 16 }}>
          Trust &amp; safety
        </h1>
        <p className="text-lead" style={{ color: "var(--ink-3)", marginBottom: 48 }}>
          Interlekt works because real people teach and real people trust each other. These are the rules
          that keep that true.
        </p>

        {/* Commitments */}
        <section style={{ marginTop: 8 }}>
          <h2 className="h2" style={{ marginBottom: 24 }}>
            Our commitments
          </h2>
          <div className="grid grid-2" style={{ gap: 24 }}>
            {COMMITMENTS.map((commitment) => (
              <div key={commitment.title} className="card">
                <h3 className="h4" style={{ marginBottom: 12 }}>
                  {commitment.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--ink-2)", lineHeight: 1.55 }}>
                  {commitment.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Verification */}
        <section style={{ marginTop: 64 }}>
          <h2 className="h2" style={{ marginBottom: 24 }}>
            Creator verification
          </h2>
          <p className="text-body" style={{ color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 24 }}>
            A creator account starts as <strong>pending</strong>. Until it is approved, the profile shows a
            verification-pending badge and no teal check. Once a person on our team approves it, the badge
            changes to <strong>verified</strong> and the teal check appears on the creator&apos;s profile
            and on every community they publish.
          </p>

          <div className="grid grid-2" style={{ gap: 24, marginBottom: 24 }}>
            {VERIFICATION_CHECKS.map((check) => (
              <div key={check.title} className="flex items-start" style={{ gap: 12 }}>
                <span className="mt-1 shrink-0 text-verify">
                  <Icon name="checkCircle" size={18} />
                </span>
                <div>
                  <p className="text-17" style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                    {check.title}
                  </p>
                  <p className="text-sm" style={{ color: "var(--ink-2)", lineHeight: 1.55 }}>
                    {check.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Alert variant="info" icon="info">
            <p>
              Verification is a manual, human decision. It is not automatic, and it is not for sale.
            </p>
          </Alert>
        </section>

        {/* Reporting */}
        <section style={{ marginTop: 64 }}>
          <h2 className="h2" style={{ marginBottom: 24 }}>
            How reporting works
          </h2>
          <p className="text-body" style={{ color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 24 }}>
            There is no in-product report form yet, so reports arrive by email. Write to{" "}
            <a href="mailto:safety@interlekt.com" style={{ color: "var(--accent)" }}>
              safety@interlekt.com
            </a>{" "}
            with the community or profile link, what happened, and any screenshots you have. Please do not
            include anything sensitive you would not want us to store.
          </p>
          <p className="text-body" style={{ color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 24 }}>
            Every report is read by a person. We will confirm that we received it, tell you what we did,
            and remove content or close accounts where the rules have been broken. We will not share the
            identity of the person who reported a problem.
          </p>

          <TableWrap>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell className="w-[18%]">Severity</TableHeadCell>
                  <TableHeadCell>Examples</TableHeadCell>
                  <TableHeadCell className="w-[22%]">Target response</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SEVERITIES.map((row) => (
                  <TableRow key={row.severity}>
                    <TableCell className="name-cell">{row.severity}</TableCell>
                    <TableCell>{row.examples}</TableCell>
                    <TableCell className="num">{row.response}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrap>
          <p className="text-xs muted" style={{ marginTop: 12 }}>
            These are the response targets we hold ourselves to. They are commitments, not guarantees.
          </p>
        </section>

        {/* Not allowed */}
        <section style={{ marginTop: 64 }}>
          <h2 className="h2" style={{ marginBottom: 24 }}>
            What we don&apos;t allow
          </h2>
          <div className="flex flex-col" style={{ gap: 24 }}>
            {NOT_ALLOWED.map((item, index) => (
              <div key={item.title} className="flex items-start" style={{ gap: 16 }}>
                <span
                  className="h5 tnum shrink-0 muted"
                  style={{ width: 24, color: "var(--ink-3)", flexShrink: 0 }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-17" style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                    {item.title}
                  </p>
                  <p className="text-sm" style={{ color: "var(--ink-2)", lineHeight: 1.55 }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data & privacy */}
        <section style={{ marginTop: 64 }}>
          <h2 className="h2" style={{ marginBottom: 24 }}>
            Data &amp; privacy
          </h2>
          <p className="text-body" style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
            Reports are handled confidentially and kept only as long as we need them. Read our{" "}
            <Link href="/privacy" style={{ color: "var(--accent)" }}>
              Privacy Policy
            </Link>{" "}
            and our{" "}
            <Link href="/cookies" style={{ color: "var(--accent)" }}>
              Cookie Policy
            </Link>{" "}
            to see exactly what is stored and where.
          </p>
        </section>

        {/* Contact */}
        <section style={{ marginTop: 64 }}>
          <h2 className="h2" style={{ marginBottom: 24 }}>
            Contact our trust &amp; safety team
          </h2>
          <div className="grid grid-2" style={{ gap: 24 }}>
            <a href="mailto:safety@interlekt.com" className="card card-hover">
              <p className="h5" style={{ marginBottom: 4 }}>
                Report a community or user
              </p>
              <p className="text-sm" style={{ color: "var(--ink-3)" }}>
                safety@interlekt.com — include the link and what happened.
              </p>
            </a>
            <a href="mailto:support@interlekt.com" className="card card-hover">
              <p className="h5" style={{ marginBottom: 4 }}>
                Something else?
              </p>
              <p className="text-sm" style={{ color: "var(--ink-3)" }}>
                support@interlekt.com — for anything that is not urgent.
              </p>
            </a>
          </div>
          <p className="text-xs muted" style={{ marginTop: 24 }}>
            Last updated: {EFFECTIVE_DATE}
          </p>
        </section>
      </LegalProse>
    </PublicShell>
  );
}
