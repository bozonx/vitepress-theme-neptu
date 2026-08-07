import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'

import { DEFAULT_ENCODING } from '../../constants.ts'
import { LOCALE_CATEGORIES_FILE } from './i18n.ts'
import type { CategoryDefinition } from '../../types.d.ts'

/**
 * Process-wide store of the resolved category registry, keyed by
 * `<absolute srcDir>::<localeIndex>`.
 *
 * Two things need the registry and they run in different phases:
 *
 *   - `loadBlogLocale` builds it while resolving the VitePress config,
 *     following the `_site.yaml` `extends` chain and supporting the `.ts`
 *     variant. It calls {@link registerCategories} with the final result.
 *   - `makePreviewItem` and `transformPageMeta` need it later, from
 *     synchronous code, and read it back through
 *     {@link getCategoriesRegistry}.
 *
 * VitePress resolves the config before it loads data files, dynamic route
 * `paths()` or `transformPageData`, so by the time the readers run the store
 * is already populated. The synchronous YAML fallback below covers the case of
 * someone using `makePreviewItem` outside `defineBlogConfig` (unit tests,
 * custom pipelines).
 *
 * The store hangs off `globalThis` for the same reason the posts cache does:
 * the theme can be loaded more than once in a single dev-server process.
 */
const STORE_KEY = '__neptuCategoriesRegistry__'

type RegistryStore = Record<string, CategoryDefinition[]>

function getStore(): RegistryStore {
  const globalObj = globalThis as Record<string, unknown>
  if (!globalObj[STORE_KEY]) globalObj[STORE_KEY] = {}
  return globalObj[STORE_KEY] as RegistryStore
}

function makeKey(srcDir: string, localeIndex: string): string {
  return `${path.resolve(srcDir || '.')}::${localeIndex}`
}

/** Keeps only well-formed entries — an entry without an `id` cannot be referenced. */
function sanitize(value: unknown, fileLabel: string): CategoryDefinition[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const record = item as Record<string, unknown>
    const id = typeof record.id === 'string' ? record.id.trim() : ''
    if (!id) {
      console.warn(
        `[vitepress-theme-neptu] ${fileLabel}: category entry without an \`id\`; ignoring.`
      )
      return []
    }
    return [{ ...record, id } as CategoryDefinition]
  })
}

/**
 * Publishes the registry resolved during config load so the synchronous
 * readers pick it up instead of re-reading YAML from disk.
 */
export function registerCategories(
  srcDir: string,
  localeIndex: string,
  categories: readonly CategoryDefinition[]
): void {
  getStore()[makeKey(srcDir, localeIndex)] = categories.slice()
}

/** Drops every cached registry. Exposed for tests. */
export function clearCategoriesRegistry(): void {
  const globalObj = globalThis as Record<string, unknown>
  globalObj[STORE_KEY] = {}
}

/**
 * Returns the category registry for one locale, reading
 * `<srcDir>/<locale>/_categories.yaml` on the first miss.
 *
 * Never throws: a missing or malformed file yields an empty registry, which
 * puts category resolution back on the pre-registry fallback path rather than
 * breaking the build.
 */
export function getCategoriesRegistry(
  srcDir: string | undefined,
  localeIndex: string | undefined
): CategoryDefinition[] {
  if (!srcDir || !localeIndex) return []

  const store = getStore()
  const key = makeKey(srcDir, localeIndex)
  const cached = store[key]
  if (cached) return cached

  const absPath = path.join(srcDir, localeIndex, LOCALE_CATEGORIES_FILE)
  let parsed: unknown = []

  if (fs.existsSync(absPath)) {
    try {
      parsed = yaml.parse(fs.readFileSync(absPath, DEFAULT_ENCODING)) || []
    } catch (error) {
      console.warn(
        `[vitepress-theme-neptu] Failed to parse ${absPath}:`,
        (error as Error)?.message
      )
      parsed = []
    }
  }

  const registry = sanitize(parsed, absPath)
  store[key] = registry
  return registry
}
