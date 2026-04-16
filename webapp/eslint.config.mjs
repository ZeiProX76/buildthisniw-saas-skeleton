import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "lib/supabase/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Next.js core-web-vitals rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // TypeScript rules
      ...tsPlugin.configs.recommended.rules,
      // React rules
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // React hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Ultra strict rules per docs
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
    },
  },
  // Config files allow require
  {
    files: ["*.config.ts", "*.config.mjs", "*.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
