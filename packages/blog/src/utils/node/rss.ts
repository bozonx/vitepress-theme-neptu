import type { Feed } from 'feed'
import { normalizeTag } from '../shared/tags.ts'
import type { ExtendedSiteConfig, PostFrontmatter, Author } from '../../types.d.ts'

type RssSiteConfig = Partial<Omit<ExtendedSiteConfig, 'userConfig' | 'site'>> & {
  site?: {
    locales?: Record<string, Partial<ExtendedSiteConfig['site']['locales'][string]>>
    themeConfig?: ExtendedSiteConfig['site']['locales'][string]['themeConfig']
  }
  userConfig?: Partial<ExtendedSiteConfig['userConfig']>
}

/** Validates required frontmatter fields for RSS. */
export function validatePostForRss(
  frontmatter: PostFrontmatter,
  url: string,
  now: Date = new Date()
): boolean {
  const errors: string[] = []

  if (!frontmatter.title) {
    errors.push('missing title')
  }

  if (!frontmatter.date) {
    errors.push('missing date')
  } else {
    // Validate date value
    const date = new Date(frontmatter.date)
    if (isNaN(date.getTime())) {
      errors.push('invalid date format')
    } else {
      // Reject dates too far in the future (1 day tolerance)
      const futureLimit = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      if (date > futureLimit) {
        errors.push('date is too far in the future')
      }
    }
  }

  if (errors.length > 0) {
    console.warn(`Post ${url} validation failed: ${errors.join(', ')}`)
    return false
  }

  return true
}

/** Creates a unique GUID for a post. */
export function createPostGuid(siteUrl: string, url: string, date?: string | Date): string {
  let dateStr = ''
  if (date) {
    const parsed = new Date(date)
    if (!isNaN(parsed.getTime())) {
      dateStr = parsed.toISOString().split('T')[0]
    }
  }
  return `${siteUrl}${url}${dateStr ? `#${dateStr}` : ''}`
}

export interface RssCategory {
  name: string
  domain: string
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, '')
}

function makeAbsoluteUrl(siteUrl: string, rawPath: string | undefined): string | undefined {
  if (!rawPath) return undefined
  if (/^[a-z\d]+:\/\//i.test(rawPath)) return rawPath

  const base = normalizeSiteUrl(siteUrl)
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
  return `${base}${path}`
}

export function getFeedPath(localeIndex: string, format: string): string {
  return `/${localeIndex}/feed.${getFormatInfo(format).extension}`
}

export function getFeedUrl(siteUrl: string, localeIndex: string, format: string): string {
  return `${normalizeSiteUrl(siteUrl)}${getFeedPath(localeIndex, format)}`
}

/** Formats tags for RSS categories. */
export function formatTagsForRss(
  tags: unknown,
  siteUrl: string,
  localeIndex: string
): RssCategory[] {
  if (!tags || !Array.isArray(tags)) return []

  const baseUrl = normalizeSiteUrl(siteUrl)

  return (tags as unknown[])
    .map((tag) => normalizeTag(tag, localeIndex))
    .filter((tag): tag is NonNullable<ReturnType<typeof normalizeTag>> => !!tag)
    .map((tag) => ({
      name: tag.name,
      domain: `${baseUrl}/${localeIndex}/tags/${tag.slug}/1`,
    }))
}

/** Validates RSS generation configuration. */
export function validateRssConfig(config: RssSiteConfig): boolean {
  const errors: string[] = []

  if (!config.site?.locales) {
    errors.push('missing site.locales configuration')
  }

  if (!config.userConfig?.siteUrl) {
    errors.push('missing siteUrl configuration')
  }

  if (!config.outDir) {
    errors.push('missing outDir configuration')
  }

  if (errors.length > 0) {
    console.error('RSS configuration validation failed:', errors.join(', '))
    return false
  }

  return true
}

export interface RssFormatInfo {
  mimeType: string
  title: string
  extension: string
  generator: (feed: Feed) => string
}

/** Returns information about the RSS format */
export function getFormatInfo(format: string): RssFormatInfo {
  const formats: Record<string, RssFormatInfo> = {
    rss: {
      mimeType: 'application/rss+xml',
      title: 'RSS Feed',
      extension: 'rss',
      generator: (feed) => feed.rss2(),
    },
    atom: {
      mimeType: 'application/atom+xml',
      title: 'Atom Feed',
      extension: 'atom',
      generator: (feed) => feed.atom1(),
    },
    json: {
      mimeType: 'application/feed+json',
      title: 'JSON Feed',
      extension: 'json',
      generator: (feed) => feed.json1(),
    },
  }

  return formats[format] ?? formats.rss!
}

/** Gets RSS format settings from configuration */
export function getRssFormats(config: RssSiteConfig): string[] {
  const configuredFormats = config.userConfig?.themeConfig?.feeds?.formats
  const knownFormats = new Set(['rss', 'atom', 'json'])

  if (!Array.isArray(configuredFormats) || configuredFormats.length === 0) {
    return ['rss', 'atom', 'json']
  }

  return [...new Set(configuredFormats)]
    .filter((format): format is string => typeof format === 'string')
    .map((format) => format.trim().toLowerCase())
    .filter((format) => knownFormats.has(format))
}

export function makeAuthorForRss(
  config: RssSiteConfig,
  frontmatter: PostFrontmatter,
  siteUrl: string,
  localeIndex: string
): { name: string; link: string } | undefined {
  if (!frontmatter.authorId) return undefined

  const authors =
    config.site?.locales?.[localeIndex]?.themeConfig?.authors ??
    config.userConfig?.locales?.[localeIndex]?.themeConfig?.authors ??
    config.userConfig?.themeConfig?.authors ??
    config.site?.themeConfig?.authors

  if (!Array.isArray(authors)) return

  const author = (authors as Author[]).find((item) => item.id === frontmatter.authorId)

  if (!author) return

  return {
    name: author.name,
    link: `${normalizeSiteUrl(siteUrl)}/authors/${author.id}/1`,
  }
}

export { makeAbsoluteUrl, normalizeSiteUrl }
