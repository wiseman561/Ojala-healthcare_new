import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react"; // Re-added React plugin

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
        process: "readonly",
        require: "readonly",
        module: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        expect: "readonly",
        jest: "readonly"
      },
      parserOptions: { // Added parser options for JSX
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: reactPlugin // Re-added React plugin
    },
    settings: { // Added React settings
      react: {
        version: "detect" // Automatically detect the React version
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "react/jsx-uses-react": "error", // Re-added React rule
      "react/jsx-uses-vars": "error" // Re-added React rule
    }
  }
];
