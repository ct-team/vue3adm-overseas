module.exports = {
  root: true,
  env: {
    node: true,
    //'vue/setup-compiler-macros': true,
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    complexity: ['error', 6],
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'prettier/prettier': 'error',
  },
};
