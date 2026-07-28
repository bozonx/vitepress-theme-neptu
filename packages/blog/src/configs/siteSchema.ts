import { z } from 'zod'

/**
 * Zod schemas for the admin-editable site config files. Every object schema
 * is deliberately `loose` — unknown keys pass through so that future theme
 * additions do not break existing configs. Every public theme field is
 * represented below; unknown keys still pass through to preserve compatible
 * VitePress extensions and future theme versions.
 *
 * These schemas are used for best-effort validation with user-friendly
 * error messages (see {@link validateAndWarn}); they do not mutate the
 * loaded payload.
 */

const AuthorLinkSchema = z.looseObject({
  type: z.string().optional(),
  url: z.string().optional(),
  title: z.string().optional(),
})

const NavLinkSchema = z.looseObject({
  text: z.string().optional(),
  href: z.string().optional(),
  icon: z.string().optional(),
  iconClass: z.string().optional(),
  class: z.string().optional(),
  desktopOnly: z.boolean().optional(),
  mobileOnly: z.boolean().optional(),
  header: z.string().optional(),
})

const VitePressNavItemSchema = z.looseObject({
  text: z.string().optional(),
  link: z.string().optional(),
  activeMatch: z.string().optional(),
  items: z.array(z.unknown()).optional(),
})

const SocialLinkSchema = z.looseObject({
  icon: z.string().optional(),
  link: z.string().optional(),
  url: z.string().optional(),
  title: z.string().optional(),
  iconClass: z.string().optional(),
  class: z.string().optional(),
  desktopOnly: z.boolean().optional(),
  mobileOnly: z.boolean().optional(),
})

const SeoSchema = z.looseObject({
  og: z.boolean().optional(),
  jsonLd: z.boolean().optional(),
  hreflang: z.boolean().optional(),
  canonical: z.boolean().optional(),
  autoCanonical: z.boolean().optional(),
  rss: z.boolean().optional(),
  maxDescriptionLength: z.number().int().min(0).optional(),
})

const TranslationSchema = z.looseObject({
  popularPosts: z.string().optional(), similarPosts: z.string().optional(),
  shareSocialMedia: z.string().optional(), currentLang: z.string().optional(),
  tagBadgeCount: z.string().optional(), tagPageHeader: z.string().optional(),
  tags: z.string().optional(), allTags: z.string().optional(),
  paginationToStart: z.string().optional(), paginationToEnd: z.string().optional(),
  toHome: z.string().optional(), toBlog: z.string().optional(), author: z.string().optional(),
  year: z.string().optional(), showMorePosts: z.string().optional(), listenPodcast: z.string().optional(),
  commentLink: z.string().optional(), allTagsCall: z.string().optional(), popularPostsCall: z.string().optional(),
  viewInAnotherLanguage: z.string().optional(), postVideoButton: z.string().optional(),
  allPostsOfAuthor: z.string().optional(), closeMenu: z.string().optional(), allPostsOfYear: z.string().optional(),
  pageNotFound: z.string().optional(), postsCount: z.string().optional(), editLink: z.string().optional(),
  postsCountForms: z.array(z.string()).optional(), search: z.string().optional(), searchInBlog: z.string().optional(),
  links: z.record(z.string(), z.string()).optional(),
  months: z.array(z.string()).optional(), podcasts: z.record(z.string(), z.string()).optional(),
  audioFile: z.record(z.string(), z.string()).optional(), fileDownload: z.record(z.string(), z.string()).optional(),
  videoFile: z.record(z.string(), z.string()).optional(), lightbox: z.record(z.string(), z.string()).optional(),
})

export const AuthorSchema = z.looseObject({
  id: z.string().min(1, 'author `id` must be a non-empty string'),
  name: z.string().optional(),
  avatar: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  aboutUrl: z.string().optional(),
  twitterHandle: z.string().optional(),
  imageWidth: z.number().optional(),
  imageHeight: z.number().optional(),
  links: z.array(AuthorLinkSchema).optional(),
})

export const AuthorsListSchema = z.array(AuthorSchema)

const ThemeConfigSchema = z
  .looseObject({
    blogTitle: z.string().optional(),
    mainHeroImg: z.string().optional(),
    repo: z.string().optional(),
    twitterSite: z.string().optional(),
    externalLinkIcon: z.boolean().optional(),
    themeSwitcher: z.boolean().optional(),
    i18nRouting: z.boolean().optional(),
    perPage: z.never().optional(
      'perPage is a build-time parameter — set it in .vitepress/config.ts, not in YAML'
    ),
    similarPostsCount: z.number().optional(),
    sidebarTagsCount: z.number().optional(),
    paginationMaxItems: z.number().optional(),
    homeBgParallaxOffset: z.number().optional(),
    postFooter: z.array(z.string()).optional(),
    postList: z.looseObject({
      showDate: z.boolean().optional(),
      showTags: z.boolean().optional(),
      showThumbnail: z.boolean().optional(),
      showPreview: z.boolean().optional(),
      showAuthor: z.boolean().optional(),
      maxPreviewLength: z.number().int().min(0).optional(),
    }).optional(),
    popularPosts: z.looseObject({
      enabled: z.boolean().optional(),
      sortBy: z.enum(['pageviews', 'uniquePageviews', 'avgTimeOnPage']).optional(),
      dataSource: z.looseObject({
        provider: z.literal('ga4').optional(),
        propertyId: z.string().nullable().optional(),
        credentialsJson: z.string().nullable().optional(),
        dataPeriodDays: z.number().int().min(1).optional(),
        dataLimit: z.number().int().min(1).optional(),
      }).optional(),
    }).optional(),
    feeds: z.looseObject({
      maxPosts: z.number().int().min(0).optional(),
      formats: z.array(z.enum(['rss', 'atom', 'json'])).optional(),
    }).optional(),
    seo: SeoSchema.optional(),
    search: z.looseObject({
      provider: z.string().optional(),
      options: z.looseObject({
        bodyMarker: z.string().optional(),
        translations: z.record(z.string(), z.unknown()).optional(),
        locales: z.record(z.string(), z.unknown()).optional(),
      }).optional(),
    }).optional(),
    donateIcon: z.string().optional(),
    recentIcon: z.string().optional(),
    popularIcon: z.string().optional(),
    byDateIcon: z.string().optional(),
    authorsIcon: z.string().optional(),
    rssIcon: z.string().optional(),
    atomIcon: z.string().optional(),
    youtubeIcon: z.string().optional(),
    tagsIcon: z.string().optional(),
    sidebarLogoSrc: z.string().optional(),
    sidebarLogoHeight: z.number().int().min(1).optional(),
    sidebarMenuLabel: z.string().optional(),
    colorThemeMenuLabel: z.string().optional(),
    langMenuLabel: z.string().optional(),
    nav: z.union([
      z.looseObject({
        donate: z.boolean().optional(),
        links: z.array(NavLinkSchema).optional(),
        socialLinks: z.array(SocialLinkSchema).optional(),
      }),
      z.array(VitePressNavItemSchema),
    ]).optional(),
    sidebar: z.looseObject({
      recent: z.boolean().optional(), popular: z.boolean().optional(),
      archive: z.boolean().optional(), authors: z.boolean().optional(),
      tags: z.boolean().optional(), donate: z.boolean().optional(),
      rssFeed: z.boolean().optional(), atomFeed: z.boolean().optional(),
      blogTitle: z.union([z.string(), z.literal(false)]).optional(),
      links: z.array(NavLinkSchema).optional(),
      bottomLinks: z.array(NavLinkSchema).optional(),
      socialLinks: z.array(SocialLinkSchema).optional(),
    }).optional(),
    donate: z.looseObject({
      url: z.string().optional(), icon: z.string().optional(),
      postDonateCall: z.string().optional(),
    }).optional(),
    editLink: z.looseObject({ pattern: z.string().optional(), text: z.string().optional() }).optional(),
    publisher: z.looseObject({ name: z.string().optional(), url: z.string().optional(), logo: z.string().optional() }).optional(),
    footer: z.looseObject({
      message: z.string().optional(), copyright: z.string().optional(),
      links: z.array(NavLinkSchema).optional(),
    }).optional(),
    socialMediaShares: z.array(z.looseObject({
      name: z.string().optional(), icon: z.string().optional(), title: z.string().optional(),
      urlTemplate: z.string().optional(), class: z.string().optional(),
      enabled: z.boolean().optional(),
    })).optional(),
    t: TranslationSchema.optional(),
    authors: z.array(AuthorSchema).optional(),
    returnToTopLabel: z.string().optional(),
    lightModeSwitchTitle: z.string().optional(),
    darkModeSwitchTitle: z.string().optional(),
    notFound: z.looseObject({}).optional(),
  })
  .optional()

export const SiteYamlSchema = z.looseObject({
  // These are developer-level options. Name them explicitly so a YAML typo is
  // reported instead of silently being ignored by the locale loader.
  siteUrl: z.never().optional(),
  base: z.never().optional(),
  srcDir: z.never().optional(),
  lang: z.string().optional(),
  title: z.string().optional(),
  titleTemplate: z.string().optional(),
  description: z.string().optional(),
  extends: z.string().optional(),
  themeConfig: ThemeConfigSchema,
})

/**
 * Runs the schema against `value`. On failure, emits a `console.warn` for
 * every issue (with path and file label), but always returns the original
 * value — validation is advisory, not blocking, so that one typo in a YAML
 * file does not prevent the whole site from building.
 */
export function validateAndWarn<T>(
  schema: z.ZodType<T>,
  value: unknown,
  fileLabel: string
): unknown {
  if (value === undefined || value === null) return value
  const result = schema.safeParse(value)
  if (result.success) return value
  for (const issue of result.error.issues) {
    const pathStr = issue.path.length ? issue.path.join('.') : '(root)'
    console.warn(
      `[vitepress-theme-neptu-blog] ${fileLabel} — ${pathStr}: ${issue.message}`
    )
  }
  return value
}
