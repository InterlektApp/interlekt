import { cn } from "@/lib/utils";

/**
 * Lesson body renderer.
 *
 * A lesson's `content` is one opaque string on the backend, so the only
 * structure the app can honour honestly is what the creator typed:
 * paragraphs, and ``` fenced code blocks. Fenced blocks are parsed here and
 * rendered with the design system's `.code-block`.
 */

type ContentBlock =
  | { kind: "text"; text: string }
  | { kind: "code"; code: string };

const FENCE = /^```(.*)$/;

export function parseLessonContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let paragraph: string[] = [];
  let code: string[] | null = null;

  const flushParagraph = () => {
    const text = paragraph.join("\n").trim();
    if (text.length > 0) blocks.push({ kind: "text", text });
    paragraph = [];
  };

  for (const line of content.split(/\r?\n/)) {
    if (FENCE.test(line.trim())) {
      if (code) {
        blocks.push({ kind: "code", code: code.join("\n") });
        code = null;
      } else {
        flushParagraph();
        code = [];
      }
      continue;
    }
    if (code) {
      code.push(line);
    } else {
      paragraph.push(line);
    }
  }

  if (code) blocks.push({ kind: "code", code: code.join("\n") });
  flushParagraph();

  return blocks;
}

export interface LessonContentProps {
  content: string;
  className?: string;
}

export function LessonContent({ content, className }: LessonContentProps) {
  const blocks = parseLessonContent(content);

  if (blocks.length === 0) {
    return (
      <p className={cn("text-body", className)} style={{ color: "var(--ink-3)" }}>
        This lesson has no written content yet.
      </p>
    );
  }

  return (
    <div className={cn("flex flex-col", className)} style={{ gap: "var(--sp-5)" }}>
      {blocks.map((block, index) =>
        block.kind === "code" ? (
          <pre key={`code-${index}`} className="code-block">
            <code>{block.code}</code>
          </pre>
        ) : (
          <p
            key={`text-${index}`}
            className="text-body"
            style={{ color: "var(--ink-2)", whiteSpace: "pre-wrap" }}
          >
            {block.text}
          </p>
        ),
      )}
    </div>
  );
}
