import fs from 'node:fs'
import path from 'node:path'

export interface StrictLocaleConfig {
  srcDir?: string
  locales?: Record<string, unknown>
}

/**
 * Enforces Neptu's single content model: every content page belongs to a
 * locale directory and only the neutral language selector may live at
 * `<srcDir>/index.md`.
 */
export function assertStrictLocaleStructure(
  config: StrictLocaleConfig,
  logPrefix: string
): void {
  if (Object.hasOwn(config.locales || {}, 'root')) {
    throw new Error(
      `${logPrefix} The VitePress \`root\` content locale is not supported. ` +
        'Use a named locale directory such as `src/en/`; reserve `src/index.md` for the language selector.'
    )
  }

  const srcDir = config.srcDir
  if (!srcDir || !fs.existsSync(srcDir)) return

  const rootMarkdownFiles = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.md') &&
        entry.name !== 'index.md'
    )
    .map((entry) => entry.name)
    .sort()

  if (rootMarkdownFiles.length) {
    throw new Error(
      `${logPrefix} Root-level content is not supported: ${rootMarkdownFiles.join(', ')}. ` +
        `Move these files into a locale directory such as ${path.join(srcDir, 'en')}; ` +
        'only `index.md` is allowed at the content root as the language selector.'
    )
  }
}
