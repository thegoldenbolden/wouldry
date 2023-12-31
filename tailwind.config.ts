import { screens } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-radix")(),
  ],
  theme: {
    extend: {
      aria: {
        invalid: 'invalid="true"',
      },
      screens: {
        xs: "320px",
        ...screens,
      },
      borderRadius: {
        inherit: "inherit",
      },
      colors: {
        primary: "hsl(var(--primary))",
        "primary-content": "hsl(var(--primary-content))",
        "primary-dark": "hsl(var(--primary-dark))",
        "primary-light": "hsl(var(--primary-light))",

        secondary: "hsl(var(--secondary))",
        "secondary-content": "hsl(var(--secondary-content))",
        "secondary-dark": "hsl(var(--secondary-dark))",
        "secondary-light": "hsl(var(--secondary-light))",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",

        copy: "hsl(var(--copy))",
        "copy-light": "hsl(var(--copy-light))",
        "copy-lighter": "hsl(var(--copy-lighter))",

        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))",
        error: "hsl(var(--error))",

        "success-content": "hsl(var(--success-content))",
        "warning-content": "hsl(var(--warning-content))",
        "danger-content": "hsl(var(--danger-content))",
        "error-content": "hsl(var(--error-content))",

        "rather-blue": "hsl(var(--rather-blue))",
        "rather-blue-content": "hsl(var(--rather-blue-content))",

        "rather-red": "hsl(var(--rather-red))",
        "rather-red-content": "hsl(var(--rather-red-content))",
      },
      animation: {
        logo: "logo 3s infinite forwards",
      },
      keyframes: {
        logo: {
          "0%": {
            strokeDashoffset: "1.5em",
            strokeDasharray: "1.5em",
          },
          "25%, 75%": {
            strokeDashoffset: "2.25em",
            strokeWidth: "0.01em",
          },
          "50%": {
            strokeDasharray: "3em",
          },
          "100%": {
            strokeDashOffset: "-1.5em",
            strokeDashArray: "1.5em",
          },
        },
      },
    },
  },
};
export default config;
