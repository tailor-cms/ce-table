module.exports = {
  root: true,
  extends: '@tailor-cms/eslint-config',
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    extraFileExtensions: ['vue'],
  },
  ignorePatterns: ['**/components.d.ts', 'dist/**'],
  rules: {
    'vue/no-undef-components': [
      'error',
      {
        ignorePatterns: ['EmbeddedContainer', 'V[A-Z]*'],
      },
    ],
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['Edit'],
      },
    ],
  },
};
