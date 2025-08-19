// eslint.config.mjs
import js from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Ignorar pastas/arquivos de build
  {
    ignores: ['dist', 'build', 'coverage', 'node_modules', '*.min.js'],
  },

  // Regras base JS (Flat)
  js.configs.recommended,

  // Vue 3 (presets “flat” do plugin)
  ...vue.configs['flat/recommended'],

  // TS + regras gerais (sem análise type-aware)
  ...typescriptEslint.configs.recommended,

  // Complementos/ajustes do projeto
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser, // parser externo para .vue
      parserOptions: {
        parser: typescriptEslint.parser, // delega <script> para TS parser
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      // 👉 habilita globais de browser e node (resolve 'console' no-undef)
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      prettier: prettierPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
        node: {
          extensions: ['.mjs', '.js', '.ts', '.d.ts', '.json', '.vue'],
        },
      },
    },
    rules: {
      /* Qualidade geral */
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],

      /* TS: deixe o @typescript-eslint cuidar de unused-vars */
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      /* Imports */
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': 'off', // TS/alias resolvem isso

      /* Limpeza de imports */
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'off',

      /* Integração Prettier (erros de formatação viram erro) */
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          printWidth: 80,
          trailingComma: 'es5',
          tabWidth: 2,
          arrowParens: 'always',
          bracketSpacing: true,
          endOfLine: 'lf',
        },
      ],
    },
  },

  // Desativa regras conflitantes com Prettier
  prettierConfig,
];
