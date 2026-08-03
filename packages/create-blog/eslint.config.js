import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default defineConfig(
  js.configs.recommended,
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
  eslintConfigPrettier
)
