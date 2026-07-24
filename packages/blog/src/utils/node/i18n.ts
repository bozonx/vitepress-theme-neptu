import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import { standardTemplate } from '../shared/string.ts'
import { DEFAULT_ENCODE } from '../../constants.ts'
import { importConfigModule } from './tsLoader.ts'
import {
  SiteYamlSchema,
  AuthorsListSchema,
  validateAndWarn,
} from '../../configs/siteSchema.ts'

// YAML file (inside the locale folder) holding the per-locale site config.
export const LOCALE_SITE_FILE = '_site.yaml'
// YAML file (inside the locale folder) holding per-locale authors.
export const LOCALE_AUTHORS_FILE = '_authors.yaml'
// YAML file (in srcDir root) holding the cross-locale shared site config.
export const SHARED_SITE_FILE = 'site.yaml'

// TS equivalents of the YAML config files. When both variants are present
// in the same folder, the TS variant wins (it is an explicit opt-in).
export const LOCALE_SITE_TS_FILE = '_site.ts'
export const LOCALE_AUTHORS_TS_FILE = '_authors.ts'
export const SHARED_SITE_TS_FILE = 'site.ts'

export interface ParseLocaleSiteProps {
  localeIndex: string
  [key: string]: unknown
}

function parseYamlWithTemplate(
  absPath: string,
  props: Record<string, unknown>
): unknown {
  if (!fs.existsSync(absPath)) {
    return {}
  }

  try {
    const raw = fs.readFileSync(absPath, DEFAULT_ENCODE)
    const substituted = standardTemplate(raw, props)
    return yaml.parse(substituted) || {}
  } catch (error) {
    console.warn(
      `Failed to parse config file ${absPath}:`,
      (error as Error)?.message
    )
    return {}
  }
}

/**
 * Loads a config file that can exist either as TypeScript (with a default
 * export) or YAML (with `${...}` template substitution). TS variant is
 * tried first; YAML variant is used as fallback.
 *
 * Returns the loaded value together with a human-readable file label that
 * downstream validators use for error messages.
 */
async function loadSiteFile(
  tsPath: string,
  yamlPath: string,
  props: Record<string, unknown>
): Promise<{ value: unknown; fileLabel: string }> {
  const tsValue = await importConfigModule<unknown>(tsPath)
  if (tsValue !== undefined) return { value: tsValue, fileLabel: tsPath }
  return { value: parseYamlWithTemplate(yamlPath, props), fileLabel: yamlPath }
}

// Reads <srcDir>/<localeIndex>/_site.{ts,yaml} (per-locale admin layer).
export async function parseLocaleSite(
  srcDir: string,
  props: ParseLocaleSiteProps
): Promise<unknown> {
  const dir = path.join(srcDir, props.localeIndex)
  const { value, fileLabel } = await loadSiteFile(
    path.join(dir, LOCALE_SITE_TS_FILE),
    path.join(dir, LOCALE_SITE_FILE),
    props as Record<string, unknown>
  )
  validateAndWarn(SiteYamlSchema, value, fileLabel)
  return value
}

// Reads <srcDir>/site.{ts,yaml} (cross-locale shared admin layer).
export async function parseSharedSite(
  srcDir: string,
  props: Record<string, unknown>
): Promise<unknown> {
  const { value, fileLabel } = await loadSiteFile(
    path.join(srcDir, SHARED_SITE_TS_FILE),
    path.join(srcDir, SHARED_SITE_FILE),
    props
  )
  validateAndWarn(SiteYamlSchema, value, fileLabel)
  return value
}

// Reads <srcDir>/<localeIndex>/_authors.{ts,yaml}. Must be an array of
// Author objects (each with an `id` field). Returns [] if no file exists.
export async function parseLocaleAuthors(
  srcDir: string,
  props: ParseLocaleSiteProps
): Promise<unknown[]> {
  const dir = path.join(srcDir, props.localeIndex)
  const { value, fileLabel } = await loadSiteFile(
    path.join(dir, LOCALE_AUTHORS_TS_FILE),
    path.join(dir, LOCALE_AUTHORS_FILE),
    props as Record<string, unknown>
  )
  if (Array.isArray(value)) {
    validateAndWarn(AuthorsListSchema, value, fileLabel)
    return value
  }
  if (value && typeof value === 'object' && Object.keys(value).length > 0) {
    console.warn(
      `[vitepress-theme-neptu-blog] ${fileLabel}: expected an array of authors; ignoring.`
    )
  }
  return []
}

/**
 * True when either the YAML or TS variant of the per-locale `_site` config
 * exists inside the locale folder. Used by auto-discovery to decide whether
 * a directory represents a content locale.
 */
export function hasLocaleSite(srcDir: string, localeIndex: string): boolean {
  const dir = path.join(srcDir, localeIndex)
  return (
    fs.existsSync(path.join(dir, LOCALE_SITE_FILE)) ||
    fs.existsSync(path.join(dir, LOCALE_SITE_TS_FILE))
  )
}
