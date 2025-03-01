import type { Config } from "tailwindcss";

/* I want text-title to be text-4xl md:text-6xl */

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#70C5FB",
        secondary: "#001E49",
        accent: "#00EF91",
        dark: "#0A0A0A",
      },
      fontSize: {},
    },
  },
  plugins: [],
} satisfies Config;
