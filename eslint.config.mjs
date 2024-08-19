import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylisticJs from "@stylistic/eslint-plugin-js";

export default [
    { files: ["**/*.{js,mjs,cjs,ts}"], ignores: ["dist/**"] },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            stylisticJs,
        },
        rules: {
            "comma-dangle": ["error", "always-multiline"],
            "semi": ["error", "always"],
            "space-in-parens": ["error", "never"],
            "space-before-blocks": ["error", "always"],
            "eol-last": ["error", "always"],
            "class-methods-use-this": ["error"],
            "no-empty-static-block": ["error"],
            "no-empty-function": ["error"],
            "default-case-last": ["error"],
            "default-param-last": ["error"],
            "eqeqeq": ["error", "always"],
            "consistent-return": ["error"],
            "no-var": ["error"],
            "block-spacing": ["error", "always"],
            "newline-per-chained-call": ["error"],
            "quotes": ["error", "double"],
            "indent": ["error", 4, { SwitchCase: 1 }],
            "object-curly-spacing": ["error", "always"],
        },
    },
];
