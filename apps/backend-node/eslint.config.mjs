import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  ...tsPlugin.configs["flat/recommended"],
  {
    files: ["src/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
