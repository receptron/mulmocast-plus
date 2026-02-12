import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import sonarjs from "eslint-plugin-sonarjs";

export default [
  {
    files: ["packages/**/src/**/*.{js,ts}"],
  },
  {
    ignores: ["**/lib/**", "**/node_modules/**"],
  },
  eslint.configs.recommended,
  sonarjs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.es2021,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      indent: ["error", 2],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^__",
          varsIgnorePattern: "^__",
          caughtErrorsIgnorePattern: "^__",
        },
      ],
      "linebreak-style": ["error", "unix"],
      quotes: "off",
      "no-shadow": "error",
      "no-param-reassign": "error",
      "no-undef": "error",
      "prefer-const": "error",
      "no-return-assign": "error",
      "object-shorthand": "error",
      semi: ["error", "always"],
      "prettier/prettier": "error",
      "no-console": "error",
      "sonarjs/no-ignored-exceptions": "error",
      "sonarjs/redundant-type-aliases": "off",
      "sonarjs/todo-tag": "off",
      "sonarjs/no-commented-code": "off",
      "sonarjs/no-unused-vars": "off",
      "sonarjs/cognitive-complexity": "warn",
    },
    plugins: {
      prettier: prettierPlugin,
    },
  },
  // mulmocast-vision: relax rules inherited from the standalone repo
  {
    files: ["packages/mulmocast-vision/**/*.{js,ts}"],
    rules: {
      "no-console": "warn",
      "no-undef": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "sonarjs/pseudo-random": "off",
      "sonarjs/class-name": "off",
      "sonarjs/publicly-writable-directories": "off",
    },
  },
  eslintConfigPrettier,
];
