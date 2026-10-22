import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand";

const COLUMNS = [
  {
    label: "Learn",
    links: [
      { label: "Explore communities", href: "/communities" },
      { label: "For creators", href: "/auth/register" },
      { label: "Pricing", href: "/pricing" },
      { label: "Help center", href: "/help" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Trust & safety", href: "/trust" },
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Cookie policy", href: "/cookies" },
      { label: "Refund policy", href: "/refunds" },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "Sign in", href: "/auth/login" },
      { label: "Create account", href: "/auth/register" },
      { label: "My learning", href: "/my-communities" },
    ],
  },
];

export function SiteFooter({ signedIn = false, isCreator = false }: { signedIn?: boolean; isCreator?: boolean }) {
  const columns = COLUMNS.map((column) => {
    if (column.label === "Learn" && signedIn) {
      return { ...column, links: column.links.filter((link) => link.label !== "For creators") };
    }
    if (column.label !== "Account" || !signedIn) return column;
    return {
      ...column,
      links: isCreator
        ? [
            { label: "Creator Studio", href: "/studio" },
            { label: "Edit creator profile", href: "/onboarding" },
          ]
        : [
            { label: "Dashboard", href: "/dashboard" },
            { label: "My learning", href: "/my-communities" },
            { label: "Profile", href: "/profile" },
            { label: "Settings", href: "/settings" },
          ],
    };
  });

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link href="/" className="brand text-white" aria-label="Interlekt home">
            <BrandMark />
            <BrandWordmark />
          </Link>
          <p className="mt-4 max-w-[280px] text-13 text-white/55">
            A learning community platform for African creators and learners. Learn a real skill, in a real
            room, for a price in naira.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.label}>
            <div className="mb-3 text-13 font-medium text-white/50">{column.label}</div>
            <ul className="flex flex-col gap-2.5 text-14">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/65 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Interlekt · Empowering ambitious minds</span>
        <span>Bank-grade security · Instant access</span>
      </div>
    </footer>
  );
}
