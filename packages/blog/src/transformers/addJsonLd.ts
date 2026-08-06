import type { HeadConfig } from 'vitepress'
import yaml from 'yaml'
import { omitUndefined, deepMerge } from '../utils/shared/index.ts'
import { toIsoDuration } from '../utils/shared/readingTime.ts'
import {
  isPost,
  generatePageUrlPath,
  isAuthorPage,
  isPage,
  makeAbsoluteUrl,
  normalizeSiteUrl,
} from '../utils/shared/index.ts'
import type {
  ExtendedPageData,
  ExtendedSiteConfig,
  ThemeConfig,
  Author,
  LocaleDefinition,
  Tag,
  I18nTranslations,
} from '../types.d.ts'

export interface AddJsonLdContext {
  page: string
  head: HeadConfig[]
  pageData: ExtendedPageData
  siteConfig: ExtendedSiteConfig
}

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== 'string') return
  const normalized = value.trim()
  return normalized || undefined
}

function toIsoDate(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') return

  const date = new Date(value as string | number | Date)
  if (Number.isNaN(date.getTime())) return

  return date.toISOString()
}

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdObject
  | JsonLdArray
interface JsonLdObject {
  [key: string]: JsonLdValue
}
type JsonLdArray = JsonLdValue[]

function parseYamlToJsonLd(strYaml: string): unknown {
  return yaml.parse(strYaml)
}

function warnInvalidJsonLd(pagePath: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  console.warn(
    `[addJsonLd] Failed to parse frontmatter.jsonLd for "${pagePath}": ${message}`
  )
}

interface ParsedCustomJsonLd {
  data: JsonLdObject | JsonLdArray
  mode: 'replace' | 'merge'
}

function filterObjectArray(arr: unknown[]): JsonLdObject[] {
  return arr.filter(
    (item): item is JsonLdObject =>
      !!item && typeof item === 'object' && !Array.isArray(item)
  )
}

function parseCustomJsonLd(
  rawJsonLd: unknown,
  pagePath: string
): ParsedCustomJsonLd | undefined {
  // Direct object from YAML frontmatter → merge mode
  if (
    rawJsonLd !== null &&
    typeof rawJsonLd === 'object' &&
    !Array.isArray(rawJsonLd)
  ) {
    if (Object.keys(rawJsonLd as JsonLdObject).length === 0) return
    return { data: rawJsonLd as JsonLdObject, mode: 'merge' }
  }

  // Direct array from YAML frontmatter → merge mode
  if (Array.isArray(rawJsonLd)) {
    const filtered = filterObjectArray(rawJsonLd)
    if (filtered.length === 0) return
    return { data: filtered, mode: 'merge' }
  }

  if (typeof rawJsonLd !== 'string' || rawJsonLd.trim() === '') return

  // JSON string → replace mode; YAML string → merge mode
  let isJson = false
  try {
    JSON.parse(rawJsonLd)
    isJson = true
  } catch {
    // Not JSON — will be parsed as YAML below
  }

  try {
    const parsed = parseYamlToJsonLd(rawJsonLd)

    if (Array.isArray(parsed)) {
      const filtered = filterObjectArray(parsed)
      if (filtered.length === 0) return
      return { data: filtered, mode: isJson ? 'replace' : 'merge' }
    }

    if (parsed && typeof parsed === 'object') {
      return {
        data: parsed as JsonLdObject,
        mode: isJson ? 'replace' : 'merge',
      }
    }
  } catch (error) {
    warnInvalidJsonLd(pagePath, error)
  }
}

function hasJsonLdEntries(jsonLdData: unknown): boolean {
  if (Array.isArray(jsonLdData)) return jsonLdData.length > 0
  return (
    !!jsonLdData &&
    typeof jsonLdData === 'object' &&
    Object.keys(jsonLdData).length > 0
  )
}

function withSchemaContext(
  jsonLdData: JsonLdObject | JsonLdArray
): JsonLdObject {
  if (Array.isArray(jsonLdData)) {
    return {
      '@context': 'https://schema.org',
      '@graph': jsonLdData as JsonLdValue,
    }
  }

  return { '@context': 'https://schema.org', ...(jsonLdData as JsonLdObject) }
}

/**
 * Mirrors the visible `Breadcrumbs` component: Google requires the markup to
 * match what the reader sees, and the component only renders a trail when the
 * post has a category.
 */
function createBreadcrumbJsonLd(
  categories: Tag[],
  siteUrl: string,
  localeIndex: string,
  localeIndexUrl: string,
  pageUrl: string,
  title: string | undefined,
  t: I18nTranslations | undefined
): JsonLdObject | undefined {
  const category = categories[0]
  if (!category?.slug) return

  const crumbs: Array<{ name: string; url: string }> = [
    { name: t?.breadcrumbHome || 'Home', url: localeIndexUrl },
    {
      name: t?.categories || 'Categories',
      url: makeAbsoluteUrl(siteUrl, `${localeIndex}/categories`) || '',
    },
    {
      name: category.name,
      url:
        makeAbsoluteUrl(siteUrl, `${localeIndex}/categories/${category.slug}/1`) ||
        '',
    },
  ]

  if (title) crumbs.push({ name: title, url: pageUrl })

  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

/** Creates JSON-LD structured data for a post. */
function createPostJsonLd(
  pageData: ExtendedPageData,
  siteConfig: ExtendedSiteConfig,
  siteUrl: string,
  localeIndexUrl: string,
  localeIndex: string,
  langConfig: LocaleDefinition,
  pageUrl: string,
  publisher: JsonLdObject | undefined
): JsonLdObject | JsonLdArray {
  const title =
    normalizeText(pageData.frontmatter.title) || normalizeText(pageData.title)
  const description =
    normalizeText(pageData.frontmatter.description) ||
    normalizeText(pageData.description)
  const author = pageData.frontmatter.authorId
    ? (langConfig.themeConfig as ThemeConfig).authors?.find(
        (item: Author) => item.id === pageData.frontmatter.authorId
      )
    : undefined

  const authorName = author?.name || author?.id
  const authorUrl = pageData.frontmatter.authorId
    ? makeAbsoluteUrl(
        siteUrl,
        `${localeIndex}/authors/${pageData.frontmatter.authorId}/1`
      )
    : undefined
  const cover = pageData.frontmatter.cover
  const tags = pageData.frontmatter.tags
  const lang = langConfig.lang
  // `transformPageMeta` already folded `category` into this normalized list.
  const categories = (pageData.frontmatter.categories || []) as Tag[]

  let article: JsonLdObject = {
    '@type': 'BlogPosting',
    headline: title || '',
    description: description || '',
    url: pageUrl,
    datePublished: toIsoDate(pageData.frontmatter.date) as JsonLdValue,
    publisher: publisher as JsonLdValue,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    inLanguage: lang || '',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${localeIndexUrl}/#website`,
      url: localeIndexUrl,
      inLanguage: lang || '',
    },
    author: (authorName && {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    }) as JsonLdValue,
    dateModified: toIsoDate(pageData.lastUpdated) as JsonLdValue,
    // Both are computed by `addReadingTime` and left off when it did not run.
    wordCount: (pageData.wordCount || undefined) as JsonLdValue,
    timeRequired: toIsoDuration(pageData.readingMinutes ?? 0) as JsonLdValue,
    keywords:
      tags && tags.length > 0
        ? (tags as Array<string | Tag>)
            .map((tag) => (typeof tag === 'string' ? tag : tag.name))
            .join(', ')
        : undefined,
    // schema.org allows repeating articleSection, so an array beats a joined
    // string — consumers get discrete values instead of one "A, B" label.
    articleSection: categories.length
      ? (categories.map((item) => item.name) as JsonLdValue)
      : undefined,
    image: (cover &&
      omitUndefined({
        '@type': 'ImageObject',
        url: makeAbsoluteUrl(siteUrl, cover),
        height: pageData.frontmatter.coverHeight,
        width: pageData.frontmatter.coverWidth,
        caption:
          pageData.frontmatter.coverDescription ||
          pageData.frontmatter.coverAlt ||
          undefined,
      })) as JsonLdValue,
  }

  if (pageData.frontmatter.jsonLd) {
    const parsed = parseCustomJsonLd(
      pageData.frontmatter.jsonLd,
      pageData.relativePath
    )
    if (parsed) {
      if (parsed.mode === 'replace') {
        // Full replacement — skip auto-generated article and breadcrumb
        return parsed.data
      }
      if (!Array.isArray(parsed.data)) {
        article = deepMerge(article, parsed.data)
      }
    }
  }

  const breadcrumb = createBreadcrumbJsonLd(
    categories,
    siteUrl,
    localeIndex,
    localeIndexUrl,
    pageUrl,
    title,
    (langConfig.themeConfig as ThemeConfig).t
  )

  return breadcrumb ? [article, breadcrumb] : article
}

function createAuthorJsonLd(
  pageData: ExtendedPageData,
  siteConfig: ExtendedSiteConfig,
  siteUrl: string,
  localeIndex: string,
  langConfig: LocaleDefinition
): JsonLdObject | undefined {
  const authors = (langConfig.themeConfig as ThemeConfig)?.authors
  const author = authors?.find(
    (item: Author) =>
      item.id === (pageData.params as Record<string, string> | undefined)?.id
  )

  if (!author) return

  const {
    id,
    name,
    description,
    image,
    links,
    imageHeight,
    imageWidth,
    ...rest
  } = author
  const authorName = name || id
  const authorUrl = makeAbsoluteUrl(siteUrl, `${localeIndex}/authors/${id}/1`)
  let imgUrl = image

  imgUrl = makeAbsoluteUrl(siteUrl, imgUrl)

  return {
    '@type': 'Person',
    name: authorName,
    url: authorUrl as JsonLdValue,
    description: description as JsonLdValue,
    image: (imgUrl && {
      '@type': 'ImageObject',
      url: imgUrl,
      height: imageHeight,
      width: imageWidth,
      caption: authorName,
    }) as JsonLdValue,
    sameAs: links?.map((link) => link.url) as JsonLdValue,
    ...(rest as unknown as JsonLdObject),
  }
}

function createPageJsonLd(
  pageData: ExtendedPageData,
  pageUrl: string,
  localeIndexUrl: string,
  publisher: JsonLdObject | undefined,
  siteName: string
): JsonLdObject | JsonLdArray {
  let page: JsonLdObject = {
    '@type': 'WebPage',
    name:
      normalizeText(pageData.frontmatter.title) ||
      normalizeText(pageData.title) ||
      '',
    url: pageUrl,
    description:
      normalizeText(pageData.frontmatter.description) ||
      normalizeText(pageData.description) ||
      '',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${localeIndexUrl}/#website`,
      name: siteName,
      url: localeIndexUrl,
    },
    publisher: publisher as JsonLdValue,
  }

  if (pageData.frontmatter.jsonLd) {
    const parsed = parseCustomJsonLd(
      pageData.frontmatter.jsonLd,
      pageData.relativePath
    )
    if (parsed) {
      if (parsed.mode === 'replace') {
        return parsed.data
      }
      if (!Array.isArray(parsed.data)) {
        page = deepMerge(page, parsed.data)
      }
    }
  }

  return page
}

/** Adds JSON-LD structured data to the page head. */
export function addJsonLd({
  page,
  head,
  pageData,
  siteConfig,
}: AddJsonLdContext): void {
  if (!page || page.indexOf('/') < 0) {
    return
  }

  if (pageData.frontmatter?.seo?.jsonLd === false) return

  let jsonLdData: JsonLdObject | JsonLdArray | undefined
  const cleanPage = page.startsWith('/') ? page.slice(1) : page
  const localeIndex = cleanPage.split('/')[0]
  if (!localeIndex) return
  const langConfig = siteConfig.site.locales[localeIndex] as LocaleDefinition

  if (!langConfig || !langConfig.themeConfig) return

  const siteUrl = normalizeSiteUrl(siteConfig.userConfig.siteUrl)
  if (!siteUrl) {
    console.warn(
      `[addJsonLd] siteUrl is not configured. JSON-LD requires absolute URLs.`
    )
    return
  }

  const localeIndexUrl = makeAbsoluteUrl(siteUrl, localeIndex)
  const pageUrl = makeAbsoluteUrl(siteUrl, generatePageUrlPath(page))
  if (!localeIndexUrl || !pageUrl) return
  // siteName: fallback resolution matches createPageJsonLd usage.
  const siteName = langConfig.title || ''
  const publisher: JsonLdObject | undefined = langConfig.themeConfig
    .publisher && {
    '@type': 'Organization',
    name: langConfig.themeConfig.publisher?.name || siteName,
    url: makeAbsoluteUrl(
      siteUrl,
      langConfig.themeConfig.publisher?.url || siteUrl
    ),
    logo: (langConfig.themeConfig.publisher?.logo && {
      '@type': 'ImageObject',
      url: makeAbsoluteUrl(siteUrl, langConfig.themeConfig.publisher.logo),
    }) as JsonLdValue,
  }

  if (isAuthorPage(page)) {
    jsonLdData = createAuthorJsonLd(
      pageData,
      siteConfig,
      siteUrl,
      localeIndex,
      langConfig
    )
  } else if (isPost(pageData.frontmatter)) {
    jsonLdData = createPostJsonLd(
      pageData,
      siteConfig,
      siteUrl,
      localeIndexUrl,
      localeIndex,
      langConfig,
      pageUrl,
      publisher
    )
  } else if (isPage(pageData.frontmatter)) {
    jsonLdData = createPageJsonLd(
      pageData,
      pageUrl,
      localeIndexUrl,
      publisher,
      siteName
    )
  } else if (pageData.frontmatter.jsonLd) {
    const parsed = parseCustomJsonLd(
      pageData.frontmatter.jsonLd,
      pageData.relativePath
    )
    if (parsed) {
      jsonLdData = parsed.data
    }
  } else {
    return
  }

  if (!hasJsonLdEntries(jsonLdData)) return

  head.push([
    'script',
    { type: 'application/ld+json' },
    JSON.stringify(
      withSchemaContext(jsonLdData as JsonLdObject | JsonLdArray),
      null,
      2
    ),
  ])
}
