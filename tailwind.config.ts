import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Comic Neue", "cursive"],
        mono: ["Comic Neue", "cursive"],
        display: ["Bangers", "cursive"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "comic-primary": "var(--comic-primary)",
        "comic-secondary": "var(--comic-secondary)",
        "comic-accent": "var(--comic-accent)",
        "comic-shadow": "var(--comic-shadow)",
      },
    },
  },
  plugins: [],
} satisfies Config;