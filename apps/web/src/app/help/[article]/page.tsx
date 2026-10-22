import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public/public-shell";
import { Icon } from "@/components/ui/icon";
import { HELP_ARTICLES, findHelpArticle, findHelpTopic } from "@/content/help";

/**
 * A16 — a single help article.
 *
 * The article body comes from the in-repo help content, so there is no
 * article API to call.
 */

interface HelpArticlePageProps {
  params: Promise<{ article: string }>;
}

export function generateStaticParams() {
  return HELP_ARTICLES.map((article) => ({ article: article.slug }));
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const { article: slug } = await params;
  const article = findHelpArticle(slug);
  if (!article) notFound();

  const topic = findHelpTopic(article.topic);

  return (
    <PublicShell active="help">
      <div className="container-narrow" style={{ paddingTop: 48, paddingBottom: 96 }}>
        <nav className="breadcrumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
          <Link href="/help">Help centre</Link>
          <span className="sep">/</span>
          {topic ? (
            <Link href={`/help?topic=${topic.id}`}>{topic.label}</Link>
          ) : (
            <span className="sep">/</span>
          )}
          {topic ? <span className="sep">/</span> : null}
          <span className="current">{article.title}</span>
        </nav>

        <h1 className="h1" style={{ marginBottom: 16 }}>
          {article.title}
        </h1>
        <p className="text-lead" style={{ color: "var(--ink-3)", marginBottom: 40 }}>
          {article.summary}
        </p>

        <div className="flex flex-col gap-4">
          {article.body.map((paragraph, index) => (
            <p key={index} className="text-body" style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              {paragraph}
            </p>
          ))}
        </div>

        <hr className="divider" style={{ margin: "48px 0 32px" }} />

        <div className="flex flex-wrap items-center justify-between" style={{ gap: 16 }}>
          <Link href="/help" className="btn btn-secondary btn-pill">
            <Icon name="chevronLeft" size={16} />
            All articles
          </Link>
          <p className="text-sm muted">
            Still stuck?{" "}
            <a href="mailto:support@interlekt.com" style={{ color: "var(--accent)" }}>
              support@interlekt.com
            </a>
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
