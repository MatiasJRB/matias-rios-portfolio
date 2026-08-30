import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Existing client components intentionally synchronize mounted/browser
      // state in effects. Keep these React Compiler rules opt-in until those
      // components are refactored independently.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
  globalIgnores([
    ".next/**",
    ".vercel/**",
    ".agent/**",
    ".agents/**",
    ".impeccable/**",
    "out/**",
    "build/**",
    // Compiled, immutable snapshots from historical repositories.
    "public/time-machine/eras/**",
    "next-env.d.ts",
  ]),
]);
