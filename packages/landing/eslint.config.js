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
    /*
     * Landing copy is authored by the site owner (markdown, YAML or config),
     * not by visitors, and routinely needs inline markup — `<br>`, `<strong>`,
     * accent spans. Same trade-off the blog theme's hero makes.
     */
    files: ['src/blocks/**/*.vue', 'src/primitives/**/*.vue'],
    rules: { 'vue/no-v-html': 'off' },
  },
  {
    // Tests routinely mount multiple components in a single defineComponent
    // wrapper — the rule is about source files, not test harnesses.
    files: ['tests/**/*.ts'],
    rules: { 'vue/one-component-per-file': 'off' },
  },
  eslintConfigPrettier
)
