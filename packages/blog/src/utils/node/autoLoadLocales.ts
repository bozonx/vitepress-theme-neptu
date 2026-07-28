import fs from 'node:fs'
import { hasLocaleSite } from './i18n.ts'
import type { LocaleDefinition } from '../../types.d.ts'

export type LocaleEntry = LocaleDefinition & { label?: string }

export interface AutoLoadLocalesOptions<TConfig> {
  /** User config containing `srcDir`. */
  config: TConfig
  /** Loads a single locale entry by `localeIndex`. */
  loadLocale: (
    localeIndex: string,
    config: TConfig
  ) => Promise<LocaleEntry>
  /** Prefix for console warnings, e.g. `[vitepress-theme-neptu]`. */
  logPrefix: string
}

/**
 * Auto-discovers every content locale under `config.srcDir` and builds the
 * `locales` map for VitePress.
 *
 * A folder `<srcDir>/<name>/` qualifies as a locale when it contains
 * `_site.yaml` or `_site.ts`. Folder names starting with `.` or `_` are
 * skipped. Results are returned sorted alphabetically by locale key.
 *
 * Generic factory used by both blog and landing themes.
 */
export async function autoLoadLocalesFactory<TConfig extends { srcDir?: string }>(
  options: AutoLoadLocalesOptions<TConfig>
): Promise<Record<string, LocaleEntry>> {
  const { config, loadLocale, logPrefix } = options
  const srcDir = config.srcDir || ''
  if (!srcDir) {
    console.warn(
      `${logPrefix} autoLoadLocales: \`srcDir\` is not set; no locales discovered.`
    )
    return {}
  }

  if (!fs.existsSync(srcDir)) {
    console.warn(
      `${logPrefix} autoLoadLocales: \`srcDir\` does not exist: ${srcDir}`
    )
    return {}
  }

  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true })
  const candidates = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('.') && !name.startsWith('_'))
    .sort()

  const locales: Record<string, LocaleEntry> = {}
  for (const name of candidates) {
    if (!hasLocaleSite(srcDir, name)) continue
    locales[name] = await loadLocale(name, config)
  }

  if (Object.keys(locales).length === 0) {
    console.warn(
      `${logPrefix} autoLoadLocales: no folders with \`_site.yaml\` or \`_site.ts\` found under ${srcDir}.`
    )
  }

  return locales
}
