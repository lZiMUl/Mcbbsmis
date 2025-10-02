const globals = require('globals');
const pluginJs = require('@eslint/js');
const tsEslint = require('typescript-eslint');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-plugin-prettier');

module.exports = {
  files: ['/src/**/*.ts'],
  plugins: {
    '@typescript-eslint': typescriptEslint,
    prettier
  },
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node
    },
    ecmaVersion: 5,
    sourceType: 'commonjs'
  },
  rules: {
    indent: ['error', 4],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'array-bracket-spacing': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    camelcase: 2,
    curly: [2, 'all'],
    'quote-props': [2, 'always'],
    strict: 2,
    'use-isnan': 2,
    'valid-jsdoc': 0,
    'valid-typeof': 2,
    'prefer-const': 0,
    'prefer-spread': 0,
    'prefer-reflect': 0,
    'no-undef': 1,
    'no-undef-init': 2,
    'no-undefined': 2,
    'no-unexpected-multiline': 2,
    'no-underscore-dangle': 1,
    'no-trailing-spaces': 1,
    'no-unreachable': 2,
    'no-unused-expressions': 2,
    'no-use-before-define': 2,
    'no-useless-call': 2,
    'no-new-func': 1,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-mixed-spaces-and-tabs': [2, false],
    'no-div-regex': 1,
    'no-dupe-keys': 2,
    'no-dupe-args': 2,
    'no-duplicate-case': 2,
    'no-else-return': 2,
    'no-empty': 2,
    'no-empty-character-class': 2,
    'no-eq-null': 2,
    'no-eval': 1,
    'no-ex-assign': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': 2,
    'no-extra-semi': 2,
    'no-fallthrough': 1,
    'no-floating-decimal': 2,
    'no-func-assign': 2,
    'no-implicit-coercion': 1,
    'no-implied-eval': 2
  },
  ...pluginJs.configs.recommended,
  ...tsEslint.configs.recommended
};
