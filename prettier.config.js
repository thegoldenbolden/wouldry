/** @type {import("prettier").Config} */
const prettierConfig = {
  printWidth: 80,
  semi: true,
  singleQuote: false,
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss"
  ],
  tailwindFunctions: ["cva", "clsx"]
};

module.exports = prettierConfig;
