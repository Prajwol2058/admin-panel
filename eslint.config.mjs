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
  {
    rules: {
      // Disable unused variable warning
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],

      // Allow `any` type, though it's not recommended for production code
      "@typescript-eslint/no-explicit-any": "off",

      // React Hook rule allows calling useEffect inside callbacks
      "react-hooks/rules-of-hooks": "off",

      // Disable img tag warning
      "@next/next/no-img-element": "off",

      // Disable anonymous default export rule
      "import/no-anonymous-default-export": "off",
    },
  },
];

export default eslintConfig;
