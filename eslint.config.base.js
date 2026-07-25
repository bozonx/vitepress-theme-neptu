import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

/**
 * Shared ESLint flat-config preset for all Neptu packages.
 *
 * @param {object} [options]
 * @param {boolean} [options.projectService=false] - Enable type-aware linting via projectService.
 * @returns {Array} Array of flat-config objects (without eslint-config-prettier — append it last in the consuming package).
 */
export function createBaseEslintConfig(options = {}) {
  const { projectService = false } = options

  return defineConfig(
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
        parserOptions: {
          ...(projectService ? { projectService: true } : {}),
          extraFileExtensions: ['.vue'],
        },
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
      files: ['**/*.mjs'],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: { ...globals.node },
      },
    },
  )
}
