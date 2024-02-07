import type { Config } from "tailwindcss";
import { fontFamily, screens } from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  plugins: [
    require("@tailwindcss/container-queries"),
    require("tailwindcss-animate"),
    require("tailwindcss-radix")(),
  ],
  theme: {
    extend: {
      aria: {
        invalid: "invalid='true'",
      },
      screens: {
        xs: "320px",
        ...screens,
      },
      borderRadius: {
        inherit: "inherit",
      },
      fontFamily: {
        sans: ["var(--font-synonym)", ...fontFamily.sans],
        chillax: ["var(--font-chillax)", ...fontFamily.sans],
      },
      colors: {
        blue: {
          DEFAULT: "hsl(var(--blue))",
          foreground: "hsl(var(--blue-foreground))",
        },
        red: {
          DEFAULT: "hsl(var(--red))",
          foreground: "hsl(var(--red-foreground))",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          foreground: "hsl(var(--border-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          light: "hsl(var(--foreground-light))",
          lighter: "hsl(var(--foreground-lighter))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
        },
      },
    },
  },
};

export default config;
