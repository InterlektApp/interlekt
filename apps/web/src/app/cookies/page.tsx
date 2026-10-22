import Link from "next/link";
import { PublicShell } from "@/components/public/public-shell";
import { LegalParagraph, LegalProse, LegalSection, LegalUpdated } from "@/components/public/legal-prose";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TableWrap,
} from "@/components/ui/data-display";

/**
 * A19 — Cookie Policy.
 *
 * Interlekt does not use cookies. It does not run analytics, advertising or
 * third-party trackers either. The session token lives in the browser's
 * local storage, so this policy describes the storage model that actually
 * applies to this product.
 */

const EFFECTIVE_DATE = "October 2026";

export default function CookiesPage() {
  return (
    <PublicShell active="about">
      <LegalProse>
        <h1 className="h1" style={{ marginBottom: 12 }}>
          Cookie Policy
        </h1>
        <LegalUpdated date={EFFECTIVE_DATE} />

        <LegalSection title="1. What cookies are">
          <LegalParagraph>
            A cookie is a small file a website asks your browser to store and send back with later
            requests. Cookies are widely used to keep people signed in, to remember preferences and to
            measure how a site is used.
          </LegalParagraph>
          <LegalParagraph>
            <strong>Interlekt does not use cookies.</strong> We do not set a cookie to identify you, and
            we do not read any cookie you may already have set for another site. This page explains what
            we store on your device instead, and why.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="2. What we store on your device">
          <LegalParagraph>
            When you sign in, Interlekt stores your session tokens in your browser&apos;s{" "}
            <strong>local storage</strong> — a part of the browser that only this site can read. The
            tokens are sent back to us as an <code>Authorization: Bearer</code> header on each API request.
            They are not readable by any other website, they are not shared with third parties, and they
            are removed when you sign out.
          </LegalParagraph>

          <TableWrap className="mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell className="w-[30%]">Storage key</TableHeadCell>
                  <TableHeadCell>Purpose</TableHeadCell>
                  <TableHeadCell className="w-[24%]">Duration</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <code>interlekt.access_token</code>
                  </TableCell>
                  <TableCell>Keeps you signed in and authorises your requests.</TableCell>
                  <TableCell>Until you sign out</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code>interlekt.refresh_token</code>
                  </TableCell>
                  <TableCell>
                    Renews your session when the access token expires. Dropped from storage if you sign in
                    without &ldquo;keep me signed in&rdquo;.
                  </TableCell>
                  <TableCell>Until you sign out</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableWrap>

          <LegalParagraph>
            We do not store your filter selections, your search history or anything else about how you
            browse. Your community filters live in the page URL, so they are shared with you when you
            copy the link and they are gone when you close the tab.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="3. Third parties, analytics and advertising">
          <LegalParagraph>
            Interlekt loads no third-party advertising, analytics or social-tracking scripts. No third
            party receives a cookie, a fingerprint or an identifier when you use the platform, and no
            data from your session is shared with advertisers.
          </LegalParagraph>
          <LegalParagraph>
            The web fonts you see are served through our own build pipeline rather than from a third-party
            font CDN, so loading a page does not tell anyone else that you visited.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="4. Managing what is stored on your device">
          <LegalParagraph>
            Signing out through Interlekt removes both tokens from your browser immediately and revokes
            the session on our servers. Clearing your browser&apos;s site data for Interlekt has the same
            effect from your side.
          </LegalParagraph>
          <LegalParagraph>
            You can also clear local storage for this site in your browser settings at any time; you will
            simply be signed out and asked to sign in again. There is no preference centre to manage
            because there are no preferences to manage today.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="5. Changes to this policy">
          <LegalParagraph>
            If we ever introduce cookies — for example if we add an analytics tool or a payment provider
            that requires them — we will update this page first and tell you what changed and why. We
            will not quietly start tracking you.
          </LegalParagraph>
        </LegalSection>

        <LegalSection title="6. Contact">
          <LegalParagraph>
            Questions about this policy go to{" "}
            <a href="mailto:privacy@interlekt.com" style={{ color: "var(--accent)" }}>
              privacy@interlekt.com
            </a>
            . See also our{" "}
            <Link href="/privacy" style={{ color: "var(--accent)" }}>
              Privacy Policy
            </Link>
            .
          </LegalParagraph>
        </LegalSection>
      </LegalProse>
    </PublicShell>
  );
}
