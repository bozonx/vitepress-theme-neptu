import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default defineConfig(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      '**/.temp/**',
    ],
  },
  { linterOptions: { reportUnusedDisableDirectives: true } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        __VUE_OPTIONS_API__: 'readonly',
        __VUE_PROD_DEVTOOLS__: 'readonly',
      },
      parserOptions: { extraFileExtensions: ['.vue'] },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/require-default-prop': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },
  {
    // Config/YAML loaders operate on dynamic VitePress site config.
    files: ['src/configs/**'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    // Renders HTML supplied through site config, mirroring the blog theme's hero.
    files: ['src/layouts/SiteHome.vue'],
    rules: { 'vue/no-v-html': 'off' },
  },
  eslintConfigPrettier
)
