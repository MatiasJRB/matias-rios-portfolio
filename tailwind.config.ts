import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        geo: "#00EE90",
      },
      fontSize: {},
      textColor: {
        primary: "#70C5FB",
        secondary: "#001E49",
        accent: "#00EF91",
        dark: "#0A0A0A",
        geo: "#00EE90",
      },
    },
  },
  plugins: [],
} satisfies Config;
