import { defineConfig } from 'eslint/config'
import { createBaseEslintConfig } from '../../eslint.config.base.js'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig(
  {
    ignores: [
      'tests/e2e/playwright-report/**',
      'tests/e2e/test-results/**',
    ],
  },
  ...createBaseEslintConfig(),
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
