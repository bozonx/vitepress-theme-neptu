import { defineConfig } from 'eslint/config'
import { createBaseEslintConfig } from '../../eslint.config.base.js'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig(
  {
    ignores: ['landing-example/**'],
  },
  ...createBaseEslintConfig(),
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/.vitepress/theme/Layout.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  eslintConfigPrettier
)
