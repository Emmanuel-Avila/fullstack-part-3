import globals from "globals";
import js from "@eslint/js"
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
  js.configs.recommended,
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  {
    rules: {
      "no-unused-vars": "error"
    }
  },
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': ['error', 2]
    }
  }
];