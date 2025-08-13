import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: process.cwd(), // Use process.cwd() instead of dynamic imports
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default [
  // …your existing config/extends
  {
    files: ['app/dashboard/**/*.ts', 'app/dashboard/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
