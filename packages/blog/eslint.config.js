import { defineConfig } from 'eslint/config'
import { createBaseEslintConfig } from '../../eslint.config.base.js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default defineConfig(
  {
    ignores: [
      '**/docs/**',
      '**/coverage/**',
      'tests/e2e/playwright-report/**',
      'tests/e2e/test-results/**',
    ],
  },
  ...createBaseEslintConfig({ projectService: true }),
  {
    files: ['tests/**'],
    languageOptions: { globals: globals.vitest },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/one-component-per-file': 'off',
      'vue/require-default-prop': 'off',
    },
  },
  {
    files: ['src/components/NeptuAuthor.vue', 'src/components/post/PostImage.vue', 'src/components/utility/HomeHero.vue'],
    rules: { 'vue/no-v-html': 'off' },
  },
  {
    files: ['**/.vitepress/theme/Layout.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  eslintConfigPrettier
)
