import type { PostFrontmatter } from '../../types.d.ts'
import { replaceRelativePathLocale } from './url.ts'

export function getFrontmatterTranslations(
  frontmatter: PostFrontmatter | null | undefined
): Record<string, string> | undefined {
  if (!frontmatter || !Object.hasOwn(frontmatter, 'translations')) return

  const translations = frontmatter.translations
  if (!translations || typeof translations !== 'object' || Array.isArray(translations)) return {}

  const normalized = Object.fromEntries(
    Object.entries(translations).flatMap(([locale, target]) => {
      if (typeof target !== 'string') return []

      const trimmed = target.trim()
      if (!trimmed) return []

      return [[locale, trimmed]]
    })
  )

  return normalized
}

export function resolveTranslationRelativePathCandidates(
  currentRelativePath: string | null | undefined,
  targetLocale: string,
  translations?: Record<string, string>
): string[] {
  if (translations) {
    const currentLocale = currentRelativePath?.split('/')[0]
    if (currentLocale === targetLocale && currentRelativePath) {
      return [currentRelativePath]
    }

    const explicitTarget = translations[targetLocale]
    if (!explicitTarget) return []
    return normalizeExplicitTranslationTarget(explicitTarget, targetLocale)
  }

  const fallbackPath = replaceRelativePathLocale(currentRelativePath, targetLocale)
  return fallbackPath ? [fallbackPath] : []
}

export function pickExistingTranslationRelativePath(
  candidates: string[],
  options: {
    knownRelativePaths?: Iterable<string>
    fileExists?: (relativePath: string) => boolean
  } = {}
): string | undefined {
  const { knownRelativePaths, fileExists } = options
  const known = knownRelativePaths ? new Set(knownRelativePaths) : undefined

  for (const candidate of candidates) {
    if (known?.has(candidate)) return candidate
    if (fileExists?.(candidate)) return candidate
    if (!known && !fileExists) return candidate
  }

  return undefined
}

function normalizeExplicitTranslationTarget(rawTarget: string, targetLocale: string): string[] {
  const trimmed = rawTarget.trim().split(/[?#]/, 1)[0]?.trim()
  if (!trimmed) return []

  const normalized = trimmed.replace(/^\/+/, '').replace(/\/+$/, '')
  if (!normalized) return []

  if (normalized.endsWith('.md')) return [normalized]
  if (normalized === targetLocale) return [`${normalized}/index.md`, `${normalized}.md`]
  if (normalized.endsWith('/index')) return [`${normalized}.md`]

  return [`${normalized}.md`, `${normalized}/index.md`]
}
