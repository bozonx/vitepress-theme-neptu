/// <reference types="vite/client" />
import {
  DefaultTheme,
  PageData,
  UserConfig,
  HeadConfig,
} from 'vitepress'

export namespace NeptuBlogTheme {
  export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[K] extends Record<string, unknown>
        ? DeepPartial<T[K]>
        : T[K]
  }

  export type BlogUserConfig = Omit<
    UserConfig<Config>,
    'locales' | 'themeConfig'
  > & {
    /**
     * `t` accepts a partial object — the theme deep-merges it over the
     * built-in defaults of the current content locale, so you only need to
     * supply the keys you want to override globally. Per-locale overrides
     * live in `<srcDir>/<locale>/_site.yaml` under `themeConfig.t`.
     */
    themeConfig?: Partial<Omit<Config, 't'>> & { t?: DeepPartial<I18n> }
    locales?: Record<
      string,
      {
        label?: string
        link?: string
        lang?: string
        title?: string
        titleTemplate?: string
        description?: string
        themeConfig?: Partial<Config>
      }
    >
    /**
     * Absolute public base URL of the site, including the `http://` or
     * `https://` protocol and without a trailing slash.
     *
     * If the VitePress `base` option is used, include that path here too,
     * for example `https://example.com/blog`.
     *
     * Used as the canonical site origin for generated sitemap URLs, RSS feeds,
     * canonical links, Open Graph metadata, JSON-LD, hreflang, and robots.txt.
     */
    siteUrl?: string
    en?: { title?: string; description?: string }
  }

  export interface Config extends DefaultTheme.Config {
    externalLinkIcon?: boolean
    themeSwitcher?: boolean
    perPage?: number
    sidebarTagsCount?: number
    similarPostsCount?: number
    homeBgParallaxOffset?: number
    paginationMaxItems?: number
    postList?: {
      showDate?: boolean
      showTags?: boolean
      showThumbnail?: boolean
      showPreview?: boolean
      showAuthor?: boolean
      maxPreviewLength?: number
    }

    popularPosts?: PopularPostsConfig
    /**
     * Ordered list of post-footer blocks. Supported keys: 'author', 'donate',
     * 'comments', 'social-share', 'edit-link', 'tags', 'similar',
     * 'popular-link'. Omit a key to hide the block; reorder to change layout.
     * Defaults to all blocks in the order above.
     */
    postFooter?: string[]

    donateIcon?: string
    recentIcon?: string
    popularIcon?: string
    byDateIcon?: string
    authorsIcon?: string
    rssIcon?: string
    atomIcon?: string
    youtubeIcon?: string
    tagsIcon?: string

    twitterSite?: string
    authors?: Author[]
    nav?: NavConfig
    sidebar?: SidebarConfig
    donate?: DonateConfig
    repo?: string
    feeds?: { maxPosts?: number; formats?: string[] }

    sidebarLogoSrc?: string
    sidebarLogoHeight?: number
    /** Blog/site name. Used as the site title fallback and sidebar title fallback. */
    blogTitle?: string
    sidebarMenuLabel?: string
    colorThemeMenuLabel?: string

    seo?: SeoConfig
    socialMediaShares?: SocialMediaShare[]

    t: I18n

    search?: {
      provider?: string
      options?: {
        bodyMarker?: string
        translations?: {
          button?: {
            buttonText?: string
            buttonAriaLabel?: string
          }
        }
        [key: string]: unknown
      }
    }

    publisher?: { name?: string; url?: string; logo?: string }

    footer?: { message?: string; copyright?: string; links?: NavLink[] }
  }

  export interface I18n {
    popularPosts: string
    similarPosts: string
    shareSocialMedia: string
    currentLang: string
    tagBadgeCount: string
    tagPageHeader: string
    tags: string
    allTags: string
    paginationToStart: string
    paginationToEnd: string
    toHome: string
    toBlog: string
    author: string
    year: string
    showMorePosts: string
    listenPodcast: string
    commentLink: string
    allTagsCall: string
    popularPostsCall: string
    viewInAnotherLanguage: string
    postVideoButton: string
    allPostsOfAuthor: string
    closeMenu: string
    allPostsOfYear: string
    pageNotFound: string
    postsCount: string
    editLink: string
    postsCountForms: string[]
    search: string
    searchInBlog: string

    links: {
      aboutBlog: string
      donate: string
      recent: string
      popular: string
      byDate: string
      links: string
      authors: string
      aboutUs: string
      rssFeed: string
      atomFeed: string
    }
    months: string[]
    podcasts: Record<string, string>
    audioFile: Record<string, string>
    fileDownload: Record<string, string>
    videoFile: Record<string, string>
    lightbox: Record<string, string>
  }

  export interface AnalyticsDataSource {
    provider: 'ga4'
    propertyId?: string | null
    credentialsJson?: string | null
    dataPeriodDays?: number
    dataLimit?: number
  }

  export interface SeoConfig {
    og?: boolean
    jsonLd?: boolean
    hreflang?: boolean
    canonical?: boolean
    autoCanonical?: boolean
    rss?: boolean
    maxDescriptionLength?: number
    [key: string]: boolean | number | undefined
  }

  export interface PopularPostsConfig {
    enabled?: boolean
    sortBy?: 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
    dataSource?: AnalyticsDataSource
  }

  export interface AuthorLink {
    type?: string
    url?: string
    title?: string
  }

  export interface Author {
    id: string
    name: string
    avatar?: string
    image?: string
    description?: string
    links?: AuthorLink[]
    aboutUrl?: string
    imageHeight?: number
    imageWidth?: number
    twitterHandle?: string
    [key: string]: unknown
  }

  export interface NavConfig {
    links?: NavLink[]
    donate?: boolean
    socialLinks?: SocialLink[]
  }

  export interface SideBarItem {
    header?: string
    href?: string
    icon?: string
    class?: string
    iconClass?: string
    mobile?: boolean
    mobileOnly?: boolean
    desktopOnly?: boolean
    text?: string
    title?: string
  }

  export interface TagInfo {
    name?: string
    slug?: string
    count?: number
  }

  export interface AuthorItem {
    id: string
    name?: string
    image?: string
    imageHeight?: number
    imageWidth?: number
    description?: string
    count?: number
  }

  export interface SocialLinkItem {
    href: string
    icon?: string
    title?: string
    target?: string
    class?: string
    iconClass?: string
    desktopOnly?: boolean
    mobileOnly?: boolean
  }

  export interface LinkItem {
    desktopOnly?: boolean
    mobileOnly?: boolean
    class?: string
    iconClass?: string
    text?: string
    href?: string
    icon?: string
    target?: string
  }

  export interface SidebarConfig {
    links?: NavLink[]
    recent?: boolean
    popular?: boolean
    archive?: boolean
    authors?: boolean
    tags?: boolean
    bottomLinks?: NavLink[]
    donate?: boolean
    socialLinks?: SocialLink[]
    rssFeed?: boolean
    atomFeed?: boolean
    /** Override the sidebar title. Defaults to `blogTitle`. Set `false` to hide. */
    blogTitle?: string | false
  }

  export interface NavLink {
    text: string
    href: string
    icon?: string
    iconClass?: string
    class?: string
    desktopOnly?: boolean
    mobileOnly?: boolean
  }

  export interface SocialLink {
    icon: string
    link: string
    url?: string
    class?: string
    iconClass?: string
    desktopOnly?: boolean
    mobileOnly?: boolean
  }

  export interface DonateConfig {
    url: string
    icon?: string
    postDonateCall?: string
  }

  export interface SocialMediaShare {
    name: string
    icon: string
    title: string
    urlTemplate: string
    class?: string
  }

  export interface Tag {
    name: string
    slug: string
    count?: number
  }

  export interface PostFrontmatter extends Record<string, unknown> {
    layout?:
      | 'post'
      | 'home'
      | 'page'
      | 'util'
      | 'tag'
      | 'archive'
      | 'author'
      | string
    /** Custom component name that replaces only the central content area. */
    contentLayout?: string
    title?: string
    description?: string
    date?: string | Date
    authorId?: string
    cover?: string
    coverHeight?: number
    coverWidth?: number
    coverDescr?: string
    coverAlt?: string
    tags?: Array<string | Tag>
    previewText?: string
    descrAsPreview?: boolean
    jsonLd?: string
    searchIncluded?: boolean
    /** Podcast platform → episode URL map, rendered as the podcast dropdown. */
    podcasts?: Record<string, string>
    /** Optional language label shown next to the podcast button, e.g. `EN`. */
    podcastLang?: string
    /** External "watch the video" URL rendered as a button at the top of a post. */
    videoLink?: string
    /** Optional language label shown next to the video button, e.g. `EN`. */
    videoLinkLang?: string
    /** URL of the discussion/comments thread rendered in the post footer. */
    commentLink?: string
    canonical?: string
    seo?: SeoConfig
    translations?: Record<string, string>

    // Home page customization
    homeTheme?: 'dark' | 'light'
    homeMaxWidth?: number
    homeBackground?: 'parallax' | 'none'
    homeBackgroundImage?: string
    homeBgParallaxOffset?: number
  }

  export interface PostLite {
    url: string
    title?: string
    date?: string | number | Date
    tags?: Array<{
      slug?: string
      name?: string
      count?: number
      [key: string]: unknown
    }>
    authorId?: string
    preview?: string
    thumbnail?: string
    cover?: string
    coverHeight?: number | string
    coverWidth?: number | string
    analyticsStats?: Record<string, number>
    [key: string]: unknown
  }

  export interface Post extends PostLite {
    excerpt?: string
    frontmatter: PostFrontmatter
  }

  export interface LocaleDefinition {
    lang?: string
    title?: string
    titleTemplate?: string
    description?: string
    head?: DefaultTheme.Config['head']
    themeConfig?: DeepPartial<Config>
    t?: DeepPartial<I18n>
    label?: string
    link?: string
  }

  export interface ExtendedPageData extends PageData {
    frontmatter: PostFrontmatter
    filePath: string
  }

  export interface ExtendedSiteConfig {
    root?: string
    srcDir?: string
    outDir?: string
    site: {
      base?: string
      locales: Record<
        string,
        LocaleDefinition & { label?: string; themeConfig?: Partial<Config> }
      >
    }
    userConfig: BlogUserConfig & { themeConfig: Partial<Config> }
    head?: HeadConfig[]
    [key: string]: unknown
  }
}

export type ThemeConfig = NeptuBlogTheme.Config
export type DeepPartial<T> = NeptuBlogTheme.DeepPartial<T>
export type PostLite = NeptuBlogTheme.PostLite
export type Post = NeptuBlogTheme.Post
export type PostFrontmatter = NeptuBlogTheme.PostFrontmatter
export type Tag = NeptuBlogTheme.Tag
export type Author = NeptuBlogTheme.Author
export type I18n = NeptuBlogTheme.I18n
export type LocaleDefinition = NeptuBlogTheme.LocaleDefinition
export type ExtendedPageData = NeptuBlogTheme.ExtendedPageData
export type ExtendedSiteConfig = NeptuBlogTheme.ExtendedSiteConfig
export type BlogUserConfig = NeptuBlogTheme.BlogUserConfig
export type SeoConfig = NeptuBlogTheme.SeoConfig
export type NavConfig = NeptuBlogTheme.NavConfig
export type SidebarConfig = NeptuBlogTheme.SidebarConfig
export type SideBarItem = NeptuBlogTheme.SideBarItem
export type TagInfo = NeptuBlogTheme.TagInfo
export type AuthorItem = NeptuBlogTheme.AuthorItem
export type SocialLinkItem = NeptuBlogTheme.SocialLinkItem
export type LinkItem = NeptuBlogTheme.LinkItem
export type SocialLink = NeptuBlogTheme.SocialLink
