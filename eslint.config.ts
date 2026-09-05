import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';

export default defineConfig([
  globalIgnores([
    'node_modules/',
    'build/',
    'lib/',
    'public/',
    'package-lock.json'
  ]),
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,mts,cts}'],
    plugins: {
      js,
      prettier
    },
    extends: ['js/recommended'],
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.browser, ...globals.node },

      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          proseWrap: 'preserve',
          arrowParens: 'avoid',
          bracketSpacing: true,
          endOfLine: 'auto',
          parser: 'typescript',
          trailingComma: 'none'
        }
      ],
      'linebreak-style': ['error', 'unix'],
      curly: [2, 'all'],
      strict: 2,
      'use-isnan': 2,
      'valid-jsdoc': 0,
      'valid-typeof': 2,
      'prefer-const': 0,
      'prefer-spread': 0,
      'prefer-reflect': 0,
      'no-unused-vars': 0,
      'no-undef': 0,
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
      'no-extra-parens': 0,
      'no-extra-semi': 2,
      'no-fallthrough': 1,
      'no-floating-decimal': 2,
      'no-func-assign': 2,
      'no-implicit-coercion': 1,
      'no-implied-eval': 2,
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  },
  {
    files: ['src/server/service/BiliBiliService.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended']
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended']
  },
  {
    files: ['**/*.json5'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended']
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
    rules: {
      'markdown/no-missing-label-refs': 'off',
      'markdown/heading-increment': 'off'
    }
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended']
  }
]);
