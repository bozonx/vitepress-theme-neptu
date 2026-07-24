import type { HeadConfig } from 'vitepress'
import {
  generatePageUrlPath,
  isPost,
  makeAbsoluteUrl,
  normalizeSiteUrl,
} from '../utils/shared/index.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
  ThemeConfig,
  Author,
  Tag,
} from '../types.d.ts'

export interface AddOgMetaTagsContext {
  head: HeadConfig[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== 'string') return
  const normalized = value.trim()
  return normalized || undefined
}

function normalizeTwitterHandle(value: unknown): string | undefined {
  if (typeof value !== 'string') return
  const handle = value.trim().replace(/^@+/, '')
  return handle ? `@${handle}` : undefined
}

/** Adds Open Graph and Twitter meta tags to the page head. */
export function addOgMetaTags({
  head,
  pageData,
  siteConfig,
}: AddOgMetaTagsContext): void {
  if (pageData.frontmatter?.seo?.og === false) return

  const siteUrl = normalizeSiteUrl(siteConfig.userConfig.siteUrl)
  if (!siteUrl) return

  const localeIndex = pageData.filePath.split('/')[0]!
  const langConfig = siteConfig.site.locales[localeIndex]
  if (!langConfig) return

  const themeConfig = langConfig.themeConfig as ThemeConfig
  const explicitCanonical = pageData.frontmatter.canonical
  const pageUrl = (() => {
    if (
      typeof explicitCanonical === 'string' &&
      explicitCanonical !== 'self' &&
      explicitCanonical !== 's'
    ) {
      try {
        const trimmed = explicitCanonical.trim()
        new URL(trimmed)
        return trimmed
      } catch {
        // invalid URL — fall through to auto-generate
      }
    }
    return makeAbsoluteUrl(siteUrl, generatePageUrlPath(pageData.relativePath))
  })()
  const title =
    normalizeText(pageData.frontmatter.title) ||
    normalizeText(pageData.title) ||
    normalizeText(langConfig.title)
  const description =
    normalizeText(pageData.frontmatter.description) ||
    normalizeText(pageData.description) ||
    normalizeText(langConfig.description)
  const cover = pageData.frontmatter.cover
  const coverUrl = cover ? makeAbsoluteUrl(siteUrl, cover) : undefined
  const imageUrl = coverUrl
  const imageAlt = normalizeText(pageData.frontmatter.coverAlt)
  const imageWidth = pageData.frontmatter.coverWidth
  const imageHeight = pageData.frontmatter.coverHeight

  const author = pageData.frontmatter.authorId
    ? themeConfig.authors?.find(
        (item: Author) => item.id === pageData.frontmatter.authorId
      )
    : undefined

  const authorUrl = author?.aboutUrl
    ? makeAbsoluteUrl(siteUrl, author.aboutUrl)
    : pageData.frontmatter.authorId
      ? makeAbsoluteUrl(
          siteUrl,
          `${localeIndex}/authors/${pageData.frontmatter.authorId}/1`
        )
      : undefined

  const tags = [
    ['property', 'og:site_name', langConfig.title || ''],
    [
      'property',
      'og:type',
      isPost(pageData.frontmatter) ? 'article' : 'website',
    ],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', pageUrl],
    ['property', 'og:locale', (langConfig.lang || localeIndex).replace(/-/g, '_')],
    ['name', 'twitter:card', coverUrl ? 'summary_large_image' : 'summary'],
    ['name', 'twitter:site', normalizeTwitterHandle(themeConfig.twitterSite)],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
  ]

  for (const [code, cfg] of Object.entries(siteConfig.site.locales)) {
    if (code === localeIndex) continue
    const altLocale = ((cfg.lang || code) as string).replace(/-/g, '_')
    tags.push(['property', 'og:locale:alternate', altLocale])
  }

  if (imageUrl) {
    tags.push(['property', 'og:image', imageUrl])
    tags.push([
      'property',
      'og:image:width',
      imageWidth ? String(imageWidth) : undefined,
    ])
    tags.push([
      'property',
      'og:image:height',
      imageHeight ? String(imageHeight) : undefined,
    ])
    tags.push(['property', 'og:image:alt', imageAlt])
    tags.push(['name', 'twitter:image', imageUrl])
    tags.push(['name', 'twitter:image:alt', imageAlt])
  }

  const twitterCreator = normalizeTwitterHandle(author?.twitterHandle)
  if (twitterCreator) {
    tags.push(['name', 'twitter:creator', twitterCreator])
  }

  if (isPost(pageData.frontmatter)) {
    if (pageData.frontmatter.date) {
      const publishedAt = new Date(pageData.frontmatter.date)
      if (!Number.isNaN(publishedAt.getTime())) {
        tags.push([
          'property',
          'article:published_time',
          publishedAt.toISOString(),
        ])
      }
    }
    if (pageData.lastUpdated) {
      const updatedAt = new Date(pageData.lastUpdated)
      if (!Number.isNaN(updatedAt.getTime())) {
        tags.push([
          'property',
          'article:modified_time',
          updatedAt.toISOString(),
        ])
        tags.push(['property', 'og:updated_time', updatedAt.toISOString()])
      }
    }
    if (pageData.frontmatter.tags) {
      const tagsList = Array.isArray(pageData.frontmatter.tags)
        ? pageData.frontmatter.tags
        : [pageData.frontmatter.tags]

      tagsList.forEach((tag: string | Tag) => {
        tags.push([
          'property',
          'article:tag',
          typeof tag === 'string' ? tag : tag.name,
        ])
      })
    }
    if (authorUrl) {
      tags.push(['property', 'article:author', authorUrl])
    }
  }

  const filteredTags = tags.filter((tag): tag is [string, string, string] =>
    Boolean(tag[0] && tag[1] && tag[2])
  )

  filteredTags.forEach(([type, name, content]) => {
    head.push(['meta', { [type]: name, content }])
  })
}
