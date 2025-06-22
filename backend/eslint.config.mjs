import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      sourceType: "module", 
      ecmaVersion: 2022,
      globals: globals.node,
    },
  },
]);