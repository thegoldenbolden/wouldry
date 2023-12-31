/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  trailingComma: "all",
  printWidth: 80,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cva"],
};
