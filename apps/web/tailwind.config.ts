import type { Config } from "tailwindcss";

/**
 * Interlekt design system — Tailwind wiring for the v3.1 redesign.
 *
 * The source of truth for every value is `src/app/design-system.css`
 * (ported from the redesign package). Colors are referenced as CSS custom
 * properties so the stylesheet and the utilities can never drift.
 *
 * The `primary`/`secondary`/`muted`/`destructive`/`card`/`border`/`input`/
 * `ring` keys are legacy aliases kept so the remaining shadcn primitives
 * (ui/button, ui/dropdown-menu) render correctly in the new theme.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1120px" },
    },
    extend: {
      colors: {
        /* Ink scale — primary text, headings, dark surfaces */
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
          4: "var(--ink-4)",
          5: "var(--ink-5)",
        },
        /* Surfaces */
        paper: {
          DEFAULT: "var(--paper)",
          2: "var(--paper-2)",
          3: "var(--paper-3)",
        },
        /* Hairlines */
        line: {
          DEFAULT: "var(--line)",
          2: "var(--line-2)",
          3: "var(--line-3)",
          soft: "var(--line-soft)",
          dark: "var(--line-dark)",
          "dark-2": "var(--line-dark-2)",
        },
        /* The single accent */
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          press: "var(--accent-press)",
          soft: "var(--accent-soft)",
          "soft-2": "var(--accent-soft-2)",
          ink: "var(--accent-ink)",
        },
        /* Status — status only, never decoration */
        success: {
          DEFAULT: "var(--success)",
          ink: "var(--success-ink)",
          soft: "var(--success-soft)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          ink: "var(--warning-ink)",
          soft: "var(--warning-soft)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          ink: "var(--danger-ink)",
          soft: "var(--danger-soft)",
        },
        /* Verification check only */
        verify: {
          DEFAULT: "var(--verify)",
          soft: "var(--verify-soft)",
        },

        /* Legacy shadcn aliases → new tokens */
        border: "var(--line)",
        input: "var(--line-2)",
        ring: "var(--accent)",
        background: "var(--paper)",
        foreground: "var(--ink)",
        primary: { DEFAULT: "var(--accent)", foreground: "#ffffff" },
        secondary: { DEFAULT: "var(--paper-2)", foreground: "var(--ink)" },
        muted: { DEFAULT: "var(--paper-2)", foreground: "var(--ink-3)" },
        destructive: { DEFAULT: "var(--danger)", foreground: "#ffffff" },
        card: { DEFAULT: "var(--paper)", foreground: "var(--ink)" },
      },
      fontSize: {
        "12": ["var(--fs-12)", { lineHeight: "1.35", letterSpacing: "var(--ls-caption)" }],
        "13": ["var(--fs-13)", { lineHeight: "1.4", letterSpacing: "var(--ls-caption)" }],
        "14": ["var(--fs-14)", { lineHeight: "1.45", letterSpacing: "var(--ls-ui)" }],
        "15": ["var(--fs-15)", { lineHeight: "1.45", letterSpacing: "var(--ls-ui)" }],
        "17": ["var(--fs-17)", { lineHeight: "var(--lh-body)", letterSpacing: "var(--ls-body)" }],
        "19": ["var(--fs-19)", { lineHeight: "1.42", letterSpacing: "var(--ls-ui)" }],
        "22": ["var(--fs-22)", { lineHeight: "1.25", letterSpacing: "var(--ls-heading)" }],
        "26": ["var(--fs-26)", { lineHeight: "1.2", letterSpacing: "var(--ls-heading)" }],
        "32": ["var(--fs-32)", { lineHeight: "1.15", letterSpacing: "var(--ls-heading)" }],
        "40": ["var(--fs-40)", { lineHeight: "1.1", letterSpacing: "var(--ls-display)" }],
        "52": ["var(--fs-52)", { lineHeight: "1.08", letterSpacing: "var(--ls-display)" }],
        "64": ["var(--fs-64)", { lineHeight: "1.05", letterSpacing: "var(--ls-display)" }],
      },
      letterSpacing: {
        display: "var(--ls-display)",
        heading: "var(--ls-heading)",
        body: "var(--ls-body)",
        ui: "var(--ls-ui)",
        caption: "var(--ls-caption)",
      },
      lineHeight: {
        tight: "var(--lh-tight)",
        snug: "var(--lh-snug)",
        head: "var(--lh-head)",
        body: "var(--lh-body)",
        relaxed: "var(--lh-relaxed)",
      },
      spacing: {
        1: "var(--sp-1)",
        2: "var(--sp-2)",
        3: "var(--sp-3)",
        4: "var(--sp-4)",
        5: "var(--sp-5)",
        6: "var(--sp-6)",
        8: "var(--sp-8)",
        10: "var(--sp-10)",
        12: "var(--sp-12)",
        16: "var(--sp-16)",
        20: "var(--sp-20)",
        24: "var(--sp-24)",
        32: "var(--sp-32)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        pop: "var(--shadow-pop)",
        modal: "var(--shadow-modal)",
        focus: "var(--shadow-focus)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "var(--content-max)",
        "content-narrow": "var(--content-max-narrow)",
        "content-wide": "1280px",
      },
      height: {
        nav: "var(--nav-h)",
        rail: "100vh",
      },
      transitionTimingFunction: {
        design: "var(--ease)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        design: "var(--dur)",
        slow: "var(--dur-slow)",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ambient-float": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "50%": { transform: "translate(4px, -6px) rotate(2deg)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 600ms var(--ease) both",
        "fade-in": "fade-in 400ms var(--ease) both",
        shimmer: "shimmer 2s ease-in-out infinite",
        "ambient-float": "ambient-float 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
