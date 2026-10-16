import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Preserve main's literal // navigation separator without editing its Timeline.
  { files: ["src/app/(timeline)/timeline/page.tsx"], rules: { "react/jsx-no-comment-textnodes": "off" } },
  // This original font link intentionally belongs only to the preserved Timeline root.
  { files: ["src/app/(timeline)/layout.tsx"], rules: { "@next/next/no-page-custom-font": "off" } },
];

export default eslintConfig;
