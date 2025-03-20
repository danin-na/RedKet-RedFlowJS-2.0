import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-inner-declarations": "error",
      "no-undef": "warn",
      "func-names": "warn",
      "no-unused-private-class-members": "warn",
      "no-unused-vars": "warn"
    }
  }
];