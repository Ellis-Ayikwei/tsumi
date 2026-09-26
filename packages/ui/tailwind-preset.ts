import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

/**
 * Shared Tsumi design tokens, same neutral scale as the admin console plus one
 * brand accent. Tokens are a Tailwind plugin (not a CSS file) so every app gets
 * them through its own Tailwind build. Apps add their own `content` globs,
 * including this package's src.
 */
const light = {
  "--background": "0 0% 100%",
  "--foreground": "240 10% 3.9%",
  "--card": "0 0% 100%",
  "--card-foreground": "240 10% 3.9%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "240 10% 3.9%",
  "--primary": "240 5.9% 10%",
  "--primary-foreground": "0 0% 98%",
  "--secondary": "240 4.8% 95.9%",
  "--secondary-foreground": "240 5.9% 10%",
  "--muted": "240 4.8% 95.9%",
  "--muted-foreground": "240 3.8% 46.1%",
  "--accent": "240 4.8% 95.9%",
  "--accent-foreground": "240 5.9% 10%",
  "--destructive": "0 72% 45%",
  "--destructive-foreground": "0 0% 98%",
  "--border": "240 5.9% 90%",
  "--input": "240 5.9% 90%",
  "--ring": "240 5.9% 10%",
  "--brand": "152 76% 30%",
  "--brand-foreground": "0 0% 100%",
  "--radius": "0.75rem",
};

const dark = {
  "--background": "240 10% 3.9%",
  "--foreground": "0 0% 98%",
  "--card": "240 8% 7%",
  "--card-foreground": "0 0% 98%",
  "--popover": "240 8% 7%",
  "--popover-foreground": "0 0% 98%",
  "--primary": "0 0% 98%",
  "--primary-foreground": "240 5.9% 10%",
  "--secondary": "240 3.7% 15.9%",
  "--secondary-foreground": "0 0% 98%",
  "--muted": "240 3.7% 15.9%",
  "--muted-foreground": "240 5% 64.9%",
  "--accent": "240 3.7% 15.9%",
  "--accent-foreground": "0 0% 98%",
  "--destructive": "0 62.8% 50%",
  "--destructive-foreground": "0 0% 98%",
  "--border": "240 3.7% 15.9%",
  "--input": "240 3.7% 15.9%",
  "--ring": "240 4.9% 83.9%",
  "--brand": "152 60% 45%",
  "--brand-foreground": "240 10% 3.9%",
};

const tokens = plugin(({ addBase, addUtilities }) => {
  addBase({
    ":root": light,
    "@media (prefers-color-scheme: dark)": { ":root": dark },
    "*": { borderColor: "hsl(var(--border))" },
    html: { WebkitTapHighlightColor: "transparent" },
    body: {
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      overscrollBehaviorY: "none",
    },
  });
  addUtilities({
    ".pb-safe": { paddingBottom: "env(safe-area-inset-bottom)" },
    ".pt-safe": { paddingTop: "env(safe-area-inset-top)" },
    ".no-scrollbar": { scrollbarWidth: "none" },
    ".no-scrollbar::-webkit-scrollbar": { display: "none" },
  });
});

const preset: Partial<Config> = {
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        brand: { DEFAULT: "hsl(var(--brand))", foreground: "hsl(var(--brand-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate, tokens],
};

export default preset;
