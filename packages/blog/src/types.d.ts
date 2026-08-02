/// <reference types="vite/client" />
import './shims-modules.d.ts'
import type {
  DefaultTheme,
  PageData,
  Theme,
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
        titleTemplate?: string | boolean
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
    /**
     * Color theme applied when the visitor has no saved preference: `blue`,
     * `green`, `purple`, `amber`, `teal`, `rose`, `magenta`, `monochrome`, or
     * the id of your own preset. Written to `data-theme` before first paint.
     */
    defaultColorTheme?: string
    /**
     * Style preset applied when the visitor has no saved preference: `soft`,
     * `sharp`, `brutal`, `glass`, `editorial`, `mono`, or the id of your own
     * preset. Written to `data-style` before first paint.
     */
    defaultStylePreset?: string
    /**
     * Show the color-theme picker in the UI. Off by default: a site normally
     * ships one chosen theme, and the picker exists for demos.
     */
    colorPicker?: boolean
    /** Show the style-preset picker in the UI. Off by default, as above. */
    stylePicker?: boolean
    i18nRouting?: boolean
    perPage?: number
    sidebarTagsCount?: number
    similarPostsCount?: number
    paginationMaxItems?: number
    postList?: {
      showDate?: boolean
      showTags?: boolean
      showThumbnail?: boolean
      showPreview?: boolean
      showAuthor?: boolean
      maxPreviewLength?: number
      /** Show the reading-time badge on list items. Defaults to false. */
      showReadingTime?: boolean
    }

    /** Reading-time estimation — see {@link ReadingTimeConfig}. */
    readingTime?: ReadingTimeConfig

    /** Draft handling — see {@link DraftsConfig}. */
    drafts?: DraftsConfig

    popularPosts?: PopularPostsConfig
    /** Declarative content and appearance of every locale home page. */
    home?: HomeConfig
    /**
     * Ordered list of post-footer blocks. Supported keys: 'author', 'donate',
     * 'comments', 'social-share', 'edit-link', 'tags', 'navigation', 'similar',
     * 'popular-link'. Omit a key to hide the block; reorder to change layout.
     * Defaults to all blocks in the order above.
     */
    postFooter?: string[]

    /**
     * Layouts that render the right-hand aside column (the `aside` slot of
     * `Layout.vue`, typically used for ad units). Supported keys: 'post',
     * 'page', 'util', 'tag', 'archive', 'author', plus the name of any custom
     * `contentLayout`. Defaults to `['post', 'util', 'tag', 'archive',
     * 'author']` — everything except the home page and `layout: page`.
     *
     * Per-page frontmatter `aside: true | false` overrides this list.
     * The column itself is only visible from 1550px viewport width.
     */
    asideLayouts?: string[]

    /**
     * Table of contents built from the page headings. Rendered in the aside
     * column on wide viewports and as a collapsible block above the article
     * below the aside breakpoint — see {@link TocConfig}.
     */
    toc?: TocConfig

    /**
     * Ad slots: which pages carry them, where they land, and whether they
     * wait for consent. The theme provides the frame only; the network
     * snippet stays with the site — see {@link AdsConfig}.
     */
    ads?: AdsConfig

    /**
     * Google Consent Mode v2 defaults and the storage key backing
     * `useConsent()`. The theme ships no banner UI: Google ads in the EEA and
     * the UK require a certified CMP wired to IAB TCF 2.2, which this config
     * is designed to sit underneath rather than replace.
     */
    consent?: ConsentConfig

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
    feeds?: {
      maxPosts?: number
      formats?: string[]
      /** Include rendered article HTML instead of only the description. Defaults to false. */
      fullContent?: boolean
    }

    /**
     * Sidebar logo. A plain string is used for both appearances; the object
     * form serves a different file per light/dark appearance. Both variants
     * are rendered and switched with CSS, so there is no flash on first paint.
     */
    sidebarLogoSrc?: string | SidebarLogo
    sidebarLogoHeight?: number
    /**
     * Optional visual name for the blog UI. Prefer the locale-level `title`
     * for the site identity and browser title; this value remains a backwards-
     * compatible fallback and can override the sidebar label.
     */
    blogTitle?: string
    sidebarMenuLabel?: string
    /** Accessible label / tooltip for the color-theme picker. */
    colorThemeMenuLabel?: string
    /** Accessible label / tooltip for the style-preset picker. */
    stylePresetMenuLabel?: string
    /** Accessible label / tooltip for the locale switcher. */
    langMenuLabel?: string
    /** Landing-only: hero image URL shown on the home page. */
    mainHeroImg?: string

    seo?: SeoConfig
    socialMediaShares?: SocialMediaShare[]

    t: I18n

    search?: {
      provider?: string
      options?: {
        bodyMarker?: string
        translations?: PagefindUITranslations
        locales?: Record<string, { translations?: PagefindUITranslations }>
        [key: string]: unknown
      }
      /**
       * Build-time indexing, run automatically at the end of `vitepress build`.
       * Pagefind is bundled with the theme, so no extra CLI step is needed.
       */
      index?: {
        /** Set to `false` to skip indexing (e.g. to run the CLI yourself). */
        enabled?: boolean
        /** Custom glob for the files to index. Defaults to all HTML files. */
        glob?: string
        /** Element treated as the document root. Defaults to `html`. */
        rootSelector?: string
        /** Selectors Pagefind should ignore while indexing. */
        excludeSelectors?: string[]
        /** Index the whole site as one language (ISO 639-1 code). */
        forceLanguage?: string
        /** Extra characters to keep when indexing words, e.g. `'<>$'`. */
        includeCharacters?: string
        /** Keep `index.html` at the end of result paths. */
        keepIndexUrl?: boolean
        /** Verbose indexing logs. */
        verbose?: boolean
        /** Path to a logfile for the indexing run. */
        logfile?: string
      }
    }

    publisher?: { name?: string; url?: string; logo?: string }

    footer?: { message?: string; copyright?: string; links?: NavLink[] }
  }

  export interface PagefindUITranslations {
    button?: {
      buttonText?: string
      buttonAriaLabel?: string
    }
    modal?: {
      noResultsText?: string
      resetButtonTitle?: string
      displayDetails?: string
      backButtonTitle?: string
      footer?: {
        selectText?: string
        selectKeyAriaLabel?: string
        navigateText?: string
        navigateUpKeyAriaLabel?: string
        navigateDownKeyAriaLabel?: string
        closeText?: string
        closeKeyAriaLabel?: string
      }
    }
  }

  export interface I18n {
    popularPosts: string
    /** Heading for the explicitly curated posts shown on a home page. */
    featuredPosts?: string
    similarPosts: string
    /** Labels for chronological navigation inside a post. */
    previousPost?: string
    nextPost?: string
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
    /** Badge shown next to a `draft: true` post. */
    draftLabel: string
    /** Tooltip of the draft badge. */
    draftTitle: string
    /** Accessible label / tooltip of the reading-time badge. */
    readingTime: string
    /** Plural forms of the reading-time unit, e.g. `['min', 'min']`. */
    readingTimeForms: string[]
    search: string
    searchInBlog: string
    /** Heading above the table of contents. */
    tocLabel: string
    /** Disclosure label above an ad unit. */
    adLabel: string

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

  export interface TocConfig {
    /** Master switch. Defaults to `true`. */
    enabled?: boolean

    /**
     * Layouts that render a table of contents. Supported keys: 'post',
     * 'page', 'util', 'tag', 'archive', 'author', plus the name of any custom
     * `contentLayout`. Defaults to `['post']` — listing and utility pages
     * have no prose to navigate.
     *
     * Per-page frontmatter `toc: true | false` overrides this list.
     */
    layouts?: string[]

    /**
     * Heading levels to include, in the shape the VitePress default theme
     * uses for `outline`: a single level, a `[min, max]` tuple, or `'deep'`
     * for h2–h6. Defaults to `[2, 3]`.
     */
    level?: number | [number, number] | 'deep'

    /**
     * Drop the table of contents when the page has fewer headings than this.
     * A two-item list restates the structure without helping anyone navigate
     * it. Defaults to `3`; `0` disables the threshold.
     */
    minHeadings?: number

    /**
     * Where the table of contents lives:
     * - `'auto'` (default) — aside column above the aside breakpoint,
     *   collapsible block above the article below it;
     * - `'aside'` — column only, no TOC on narrow viewports;
     * - `'top'` — collapsible block at every width, leaving the column to ads.
     */
    position?: 'auto' | 'aside' | 'top'

    /**
     * Whether the collapsible block starts closed. Defaults to `true`:
     * expanded, a long list is a screenful to scroll past before the article.
     */
    collapsed?: boolean

    /** Heading above the list. Falls back to the `tocLabel` translation. */
    label?: string
  }

  export interface AdsConfig {
    /** Master switch. Defaults to `true`. */
    enabled?: boolean

    /**
     * Layouts that may carry ad slots. Defaults to `['post']`.
     * Per-page frontmatter `ads: true | false` overrides this list.
     */
    layouts?: string[]

    /**
     * What an absent frontmatter `layout` counts as when matching
     * {@link layouts}. Defaults to `'post'` in the blog theme; the landing
     * theme sets `'doc'`, matching the VitePress default.
     */
    defaultLayout?: string

    /**
     * Globally registered component rendering the actual ad unit. It receives
     * `placement` and `index` props. Without it, `NeptuAd` renders only what
     * its default slot provides.
     */
    component?: string

    /** Slot in the right-hand column. Defaults to `true`. */
    aside?: boolean

    /** In-content slots, placed at build time by the markdown plugin. */
    inContent?: {
      /** Defaults to `true`. */
      enabled?: boolean
      /**
       * What to place the slot before: `'heading'` (top-level `##`, the
       * default) sits at a section break; `'paragraph'` splits the prose.
       */
      anchor?: 'heading' | 'paragraph'
      /** Ordinal of the first anchor to use, 1-based. Defaults to `2`. */
      start?: number
      /** Anchors between consecutive slots. Defaults to `3`. */
      every?: number
      /** Hard cap per page. Defaults to `2`. */
      max?: number
      /**
       * Skip short articles: pages with fewer top-level blocks than this get
       * no in-content slots. Defaults to `6`.
       */
      minBlocks?: number
    }

    /** Slot after the article body, before the post footer. Defaults to `false`. */
    afterContent?: boolean

    /**
     * Render nothing until the visitor has granted ad consent. Defaults to
     * `false`: a certified CMP already withholds personalised ads on its own,
     * and blanking the slot would also drop the non-personalised ads such a
     * visitor may still be served.
     */
    requireConsent?: boolean

    /**
     * Reserved height in pixels per placement, keeping a slot from shifting
     * the page once the network responds.
     */
    minHeight?: Partial<Record<'aside' | 'in-content' | 'after-content', number>>

    /**
     * Disclosure label above the unit. Falls back to the `adLabel`
     * translation; set to an empty string to render none.
     */
    label?: string
  }

  export interface ConsentConfig {
    /**
     * Emit the Consent Mode v2 head script. Defaults to `true`. Turn off only
     * when a CMP sets the defaults itself — leaving both in place means the
     * later call wins, which may not be the one you intended.
     */
    enabled?: boolean

    /**
     * Starting signal values. Everything defaults to denied, which is what
     * Consent Mode requires before a visitor has chosen.
     */
    defaults?: Partial<ConsentState>

    /**
     * Restrict the defaults to these regions (ISO 3166-2 codes, e.g.
     * `['ES', 'US-CA']`). Omit to apply them everywhere.
     */
    region?: string[]

    /**
     * Milliseconds tags wait for a CMP to update the signals before acting on
     * the defaults. Defaults to `500`.
     */
    waitForUpdate?: number

    /** localStorage key holding the decision. Defaults to `'neptu-consent'`. */
    storageKey?: string
  }

  export interface ConsentState {
    analytics: boolean
    ads: boolean
    adUserData: boolean
    adPersonalization: boolean
    functional: boolean
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
    /** What to show when GA4 returned no statistics. Defaults to recent posts. */
    fallback?: 'latest' | 'hide'
    dataSource?: AnalyticsDataSource
  }

  export type HomeSectionType = 'featured' | 'latest' | 'popular' | 'tags'

  export interface HomeSectionConfig {
    type: HomeSectionType
    /** Disabled sections keep their position and can be enabled in YAML. */
    enabled?: boolean
    /** Maximum items. When omitted, one `perPage` page is shown. */
    limit?: number
  }

  export interface HomeActionConfig {
    text: string
    href: string
    icon?: string
    primary?: boolean
  }

  export interface HomeConfig {
    /** Follow the visitor preference, or force one appearance on the home page. */
    appearance?: 'auto' | 'light' | 'dark'
    maxWidth?: number
    background?: 'parallax' | 'none'
    backgroundImage?: string
    bgParallaxOffset?: number
    hero?: {
      title?: string
      description?: string
      image?: { src?: string; alt?: string }
      actions?: HomeActionConfig[]
    }
    /** Ordered home blocks. Arrays replace across YAML config layers. */
    sections?: HomeSectionConfig[]
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

  /** Per-appearance sidebar logo. Both files are shipped; CSS picks one. */
  export interface SidebarLogo {
    light: string
    dark: string
    /** Alt text. Empty by default — the logo duplicates the adjacent link. */
    alt?: string
  }

  export interface ReadingTimeConfig {
    /** Defaults to true. */
    enabled?: boolean
    /** Words per minute used for the estimate. Defaults to 200. */
    wpm?: number
    /**
     * Layouts that render the reading-time badge in the post header. Defaults
     * to `['post']`. Per-page frontmatter `readingTime: true | false` wins.
     */
    layouts?: string[]
  }

  export interface DraftsConfig {
    /**
     * Keep `draft: true` posts in lists, feeds and the search index.
     * Defaults to `true` in `vitepress dev` and `false` in a production build,
     * so drafts are previewable while writing and never ship by accident.
     */
    includeDrafts?: boolean
    /** Show the "draft" badge next to a draft post. Defaults to true. */
    showBadge?: boolean
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
    enabled?: boolean
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
    /** Marks the post for explicit featured-post collections. Does not change chronological lists. */
    featured?: boolean
    /**
     * Keeps the post out of lists, feeds, sitemap and search index, and marks
     * the page `noindex`. The page itself is still built, so its URL can be
     * opened for preview.
     */
    draft?: boolean
    /**
     * Force the reading-time badge on or off for this page, overriding
     * `themeConfig.readingTime.layouts`.
     */
    readingTime?: boolean
    previewText?: string
    descrAsPreview?: boolean
    jsonLd?: string
    searchIncluded?: boolean
    /**
     * Force the right-hand aside column on or off for this page, overriding
     * `themeConfig.asideLayouts`. Ignored on the home page.
     */
    aside?: boolean
    /**
     * Force the table of contents on or off for this page, overriding
     * `themeConfig.toc.layouts`. The heading-count threshold still applies.
     */
    toc?: boolean
    /**
     * Force ad slots on or off for this page, overriding
     * `themeConfig.ads.layouts`. Also honoured by the markdown plugin that
     * places in-content slots at build time.
     */
    ads?: boolean
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
    featured?: boolean
    /** Mirrors `frontmatter.draft`. Only ever true when drafts are included. */
    draft?: boolean
    /** Number of words in the post body, counted at build time. */
    wordCount?: number
    /** Estimated reading time in whole minutes. */
    readingTime?: number
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
    titleTemplate?: string | boolean
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
    /** Word count of the post body, added by `addReadingTime`. */
    wordCount?: number
    /** Estimated reading time in whole minutes, added by `addReadingTime`. */
    readingTime?: number
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
/**
 * Same as `ThemeConfig` but also allows arbitrary user-defined keys.
 * The theme deep-merges and preserves any extra fields declared in
 * `themeConfig` (config.ts, site.yaml, or _site.yaml), making them
 * accessible at runtime via `useUiTheme()`. Known Neptu fields keep
 * their specific types; custom fields resolve to `unknown`.
 */
export type RuntimeThemeConfig = NeptuBlogTheme.Config & {
  [key: string]: unknown
}
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
export type SocialMediaShare = NeptuBlogTheme.SocialMediaShare
export type PagefindUITranslations = NeptuBlogTheme.PagefindUITranslations
export type TocConfig = NeptuBlogTheme.TocConfig
export type AdsConfig = NeptuBlogTheme.AdsConfig
export type ReadingTimeConfig = NeptuBlogTheme.ReadingTimeConfig
export type DraftsConfig = NeptuBlogTheme.DraftsConfig
export type HomeConfig = NeptuBlogTheme.HomeConfig
export type HomeSectionConfig = NeptuBlogTheme.HomeSectionConfig
export type SidebarLogo = NeptuBlogTheme.SidebarLogo
export type ConsentConfig = NeptuBlogTheme.ConsentConfig
export type ConsentState = NeptuBlogTheme.ConsentState

declare const theme: Theme
export default theme
