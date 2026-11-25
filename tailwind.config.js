/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          soft: "var(--color-primary-soft)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          soft: "var(--color-primary-soft)",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-primary-soft)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          alt: "var(--color-surface-alt)",
        },
        card: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text)",
        },
        background: "var(--color-bg)",
        foreground: "var(--color-text)",
        border: "var(--color-border)",
        input: "var(--color-border)",
        ring: "var(--color-primary)",
        muted: {
          DEFAULT: "var(--color-surface-alt)",
          foreground: "var(--color-text-muted)",
        },
        subtle: "var(--color-text-subtle)",
        danger: "var(--color-danger)",
        destructive: {
          DEFAULT: "var(--color-danger)",
          foreground: "#FFFFFF",
        },
        warning: "var(--color-warning)",
        success: "var(--color-success)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.08)",
        raised: "0 4px 12px rgba(16,24,40,0.10)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
