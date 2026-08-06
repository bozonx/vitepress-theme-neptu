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
    themeConfig?: Partial<Omit<Config, 't'>> & { t?: DeepPartial<I18nTranslations> }
    locales?: Record<string, BlogLocaleConfig>
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
    /**
     * The locale key (folder name) that serves as the site's primary language.
     *
     * Used as the `x-default` target in hreflang tags and as the source of
     * title/description for the root language selector page at `/`.
     * When omitted, the first locale by key order is used as a fallback.
     */
    primaryLocale?: string
    /** Fallback title/description for the root language selector page at `/`. */
    rootMeta?: { title?: string; description?: string }
  }

  export type ResolvedBlogConfig = BlogUserConfig & {
    head: NonNullable<UserConfig['head']>
    locales: NonNullable<BlogUserConfig['locales']>
    markdown: NonNullable<UserConfig['markdown']> & {
      image: NonNullable<NonNullable<UserConfig['markdown']>['image']>
    }
    sitemap: NonNullable<UserConfig['sitemap']> & {
      transformItems: NonNullable<
        NonNullable<UserConfig['sitemap']>['transformItems']
      >
    }
    themeConfig: Partial<Config> & {
      popularPosts: NonNullable<Config['popularPosts']>
      home: NonNullable<Config['home']>
      feeds: NonNullable<Config['feeds']>
      seo: NonNullable<Config['seo']>
      t: I18nTranslations
    }
    vite: NonNullable<UserConfig['vite']> & {
      ssr: NonNullable<NonNullable<UserConfig['vite']>['ssr']>
      build: NonNullable<NonNullable<UserConfig['vite']>['build']>
    }
  }

  export interface BlogLocaleConfig {
    label?: string
    link?: string
    lang?: string
    title?: string
    titleTemplate?: string | boolean
    description?: string
    themeConfig?: Partial<Config>
  }

  export interface PostListConfig {
    showDate?: boolean
    showTags?: boolean
    showThumbnail?: boolean
    showPreview?: boolean
    showAuthor?: boolean
    maxPreviewLength?: number
    /** Show the reading-time badge on list items. Defaults to false. */
    showReadingTime?: boolean
  }

  export interface FeedsConfig {
    maxPosts?: number
    formats?: string[]
    /** Include rendered article HTML instead of only the description. Defaults to false. */
    fullContent?: boolean
  }

  export interface SearchConfig {
    enabled?: boolean
  }

  export interface PublisherConfig {
    name?: string
    url?: string
    logo?: string
  }

  export interface FooterConfig {
    message?: string
    copyright?: string
    links?: NavLink[]
    rssFeed?: boolean
    atomFeed?: boolean
    socialLinks?: SocialLink[]
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
    similarPostsCount?: number
    paginationMaxItems?: number
    postList?: PostListConfig

    /** Reading-time estimation — see {@link ReadingTimeConfig}. */
    readingTime?: ReadingTimeConfig

    /** Draft handling — see {@link DraftsConfig}. */
    drafts?: DraftsConfig

    popularPosts?: PopularPostsConfig
    /** Declarative content and appearance of every locale home page. */
    home?: HomeConfig
    /**
     * Ordered list of post-footer blocks. Supported keys: 'author', 'donate',
     * 'comments', 'social-share', 'edit-link', 'categories', 'tags',
     * 'similar'. Omit a key to hide the block;
     * reorder to change layout.
     * Defaults to all blocks in the order above.
     */
    postFooter?: string[]

    /**
     * Layouts that render the right-hand aside column (the `aside` slot of
     * `Layout.vue`, typically used for ad units). Supported keys: 'post',
     * 'page', 'util', 'tag', 'category', 'archive', 'author', plus the name of any custom
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
    featuredIcon?: string
    byDateIcon?: string
    authorsIcon?: string
    rssIcon?: string
    atomIcon?: string
    youtubeIcon?: string
    tagsIcon?: string
    categoriesIcon?: string

    twitterSite?: string
    authors?: Author[]
    nav?: NavConfig
    sidebar?: SidebarConfig
    donate?: DonateConfig
    repo?: string
    feeds?: FeedsConfig

    sidebarMenuLabel?: string
    /** Accessible label / tooltip for the color-theme picker. */
    colorThemeMenuLabel?: string
    /** Accessible label / tooltip for the style-preset picker. */
    stylePresetMenuLabel?: string
    /** Accessible label / tooltip for the locale switcher. */
    langMenuLabel?: string

    seo?: SeoConfig
    socialMediaShares?: SocialMediaShare[]

    t: I18nTranslations

    /**
     * Search powered by Pagefind — the only provider the theme supports.
     *
     * Pagefind is bundled with the theme: the index is built automatically at
     * the end of `vitepress build`, and the UI bundle is loaded on demand from
     * `/pagefind/`. No extra CLI step or devDependency is needed.
     *
     * Set `enabled: false` to skip both the index build and the search button.
     * This is useful when you prefer to run the `pagefind` CLI yourself with
     * custom flags, or when search is not needed.
     *
     * UI translations (modal labels, keyboard hints, etc.) are localised
     * through the standard `t.searchUI` key — see `I18nTranslations.searchUI`.
     * Pagefind documentation: https://pagefind.app
     */
    search?: SearchConfig

    publisher?: PublisherConfig

    footer?: FooterConfig
  }

  export interface I18nTranslations {
    popularPosts: string
    /** Heading for the explicitly curated posts shown on a home page. */
    featuredPosts?: string
    similarPosts: string
    shareSocialMedia: string
    currentLang: string
    tagBadgeCount: string
    tagPageHeader: string
    tags: string
    allTags: string
    /** Section caption above the sidebar category cloud, and the crumb label. */
    categories: string
    /** Title of the `categories/` index page. */
    allCategories: string
    /** Title prefix of a `categories/<slug>/<page>` page. */
    categoryPageHeader: string
    /** Tooltip of the post-count badge on a category chip. */
    categoryBadgeCount: string
    /** Call-to-action linking to the category index. */
    allCategoriesCall: string
    /** Short label for the home crumb — `toHome` is a tooltip, not a label. */
    breadcrumbHome: string
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
    /**
     * Translations for the Pagefind search modal UI. Override these per-locale
     * via `themeConfig.t.searchUI` in `site.yaml` or `_site.yaml`.
     * See https://pagefind.app/docs/ui/ for the full reference.
     */
    searchUI?: SearchUIConfig
    /** Heading above the table of contents. */
    tocLabel: string
    /** Disclosure label above an ad unit. */
    adLabel: string

    links: I18nLinks
    months: string[]
    podcasts: Record<string, string>
    audioFile: Record<string, string>
    fileDownload: Record<string, string>
    videoFile: Record<string, string>
    lightbox: Record<string, string>
  }

  export interface SearchUIFooter {
    selectText?: string
    selectKeyAriaLabel?: string
    navigateText?: string
    navigateUpKeyAriaLabel?: string
    navigateDownKeyAriaLabel?: string
    closeText?: string
    closeKeyAriaLabel?: string
  }

  export interface SearchUIConfig {
    noResultsText?: string
    resetButtonTitle?: string
    displayDetails?: string
    backButtonTitle?: string
    footer?: SearchUIFooter
  }

  export interface I18nLinks {
    aboutBlog: string
    donate: string
    recent: string
    featured?: string
    popular: string
    byDate: string
    links: string
    authors: string
    aboutUs: string
    rssFeed: string
    atomFeed: string
  }

  export interface TocConfig {
    /** Master switch. Defaults to `true`. */
    enabled?: boolean

    /**
     * Layouts that render a table of contents. Supported keys: 'post',
     * 'page', 'util', 'tag', 'category', 'archive', 'author', plus the name of any custom
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

  export interface InContentAdsConfig {
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
    inContent?: InContentAdsConfig

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
    regions?: string[]

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
    rssLinks?: boolean
    rss?: boolean
    maxDescriptionLength?: number
  }

  export interface PopularPostsConfig {
    enabled?: boolean
    sortBy?: 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
    dataSource?: AnalyticsDataSource
  }

  export type HomeSectionType =
    | 'featured'
    | 'latest'
    | 'popular'
    | 'tags'
    | 'categories'

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

  export interface HomeBackgroundConfig {
    type?: 'parallax' | 'none'
    image?: string
    parallaxOffset?: number
  }

  export type HomeHeroImage =
    | string
    | {
        src?: string
        light?: string
        dark?: string
        alt?: string
      }

  export interface HomeHeroConfig {
    title?: string
    description?: string
    image?: HomeHeroImage
    actions?: HomeActionConfig[]
  }

  export interface HomeConfig {
    /** Follow the visitor preference, or force one appearance on the home page. */
    appearance?: 'auto' | 'light' | 'dark'
    maxWidth?: number
    background?: HomeBackgroundConfig
    hero?: HomeHeroConfig
    /** Ordered home blocks. Arrays replace across YAML config layers. */
    sections?: HomeSectionConfig[]
  }

  export interface AuthorLink {
    type?: string
    url?: string
    title?: string
  }

  /** Shared fields between config-time and runtime author representations. */
  export interface AuthorBase {
    id: string
    name?: string
    image?: string
    imageHeight?: number
    imageWidth?: number
    description?: string
  }

  export interface Author extends AuthorBase {
    name: string
    links?: AuthorLink[]
    twitterHandle?: string
    [key: string]: unknown
  }

  export interface NavConfig {
    links?: NavLink[]
    donate?: boolean
    socialLinks?: SocialLink[]
  }

  export interface SidebarItem extends BaseLink {
    header?: string
    href?: string
    icon?: string
    mobile?: boolean
    text?: string
    title?: string
  }

  export interface TaxonomyEntry {
    name?: string
    slug?: string
    count?: number
    [key: string]: unknown
  }

  export interface AuthorItem extends AuthorBase {
    count?: number
  }

  export interface SocialLinkItem extends BaseLink {
    href: string
    icon?: string
    title?: string
    target?: string
  }

  export interface LinkItem extends BaseLink {
    text?: string
    title?: string
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
    showDrafts?: boolean
  }

  export interface SidebarConfig {
    links?: NavLink[]
    recent?: boolean
    featured?: boolean
    popular?: boolean
    archive?: boolean
    authors?: boolean
    tags?: boolean
    /** Show the category cloud section. Off unless set. */
    categories?: boolean
    /** Max tags shown in the sidebar tag cloud before the "all" link appears. Defaults to 15. */
    tagsCount?: number
    /** Max categories shown in the sidebar category cloud before the "all" link appears. Defaults to 10. */
    categoriesCount?: number
    bottomLinks?: NavLink[]
    donate?: boolean
    socialLinks?: SocialLink[]
    rssFeed?: boolean
    atomFeed?: boolean
    /** Override the sidebar title. Defaults to the locale `title`. Set `false` to hide. */
    sidebarTitle?: string | false
    /**
     * Sidebar logo. A plain string is used for both appearances; the object
     * form serves a different file per light/dark appearance. Both variants
     * are rendered and switched with CSS, so there is no flash on first paint.
     */
    logoSrc?: string | SidebarLogo
    /**
     * Logo height in pixels — used as a placeholder so the browser can reserve
     * vertical space before the image loads (prevents layout shift / CLS).
     * Defaults to 158.
     */
    logoHeight?: number
  }

  /** Common optional fields shared by all link-like types. */
  export interface BaseLink {
    class?: string
    iconClass?: string
    desktopOnly?: boolean
    mobileOnly?: boolean
  }

  export interface NavLink extends BaseLink {
    text: string
    href: string
    title?: string
    icon?: string
  }

  export interface SocialLink extends BaseLink {
    icon: string
    href: string
    title?: string
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

  export interface Tag extends TaxonomyEntry {
    name: string
    slug: string
  }

  export interface BreadcrumbItem {
    text: string
    /**
     * Locale-relative (`categories/frontend/1`) or absolute. Omit on the last
     * crumb — the current page is rendered as plain text.
     */
    href?: string
  }

  export interface PostFrontmatter extends Record<string, unknown> {
    layout?:
      | 'post'
      | 'home'
      | 'page'
      | 'util'
      | 'tag'
      | 'category'
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
    coverDescription?: string
    coverAlt?: string
    tags?: Array<string | Tag>
    /**
     * Sugar for a single-entry `categories` list. Folded into `categories`
     * during `transformPageData`, so components only ever read `categories`.
     */
    category?: string
    categories?: Array<string | TaxonomyEntry>
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
    descriptionAsPreview?: boolean
    jsonLd?: string | Record<string, unknown> | unknown[]
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
    homeBackgroundParallaxOffset?: number
  }

  export interface PostLite {
    url: string
    title?: string
    date?: string | number | Date
    tags?: Array<TaxonomyEntry>
    categories?: Array<TaxonomyEntry>
    authorId?: string
    preview?: string
    cover?: string
    coverHeight?: number | string
    coverWidth?: number | string
    featured?: boolean
    /** Mirrors `frontmatter.draft`. Only ever true when drafts are included. */
    draft?: boolean
    /** Number of words in the post body, counted at build time. */
    wordCount?: number
    /** Estimated reading time in whole minutes. */
    readingMinutes?: number
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
    t?: DeepPartial<I18nTranslations>
    label?: string
    link?: string
  }

  export interface ExtendedPageData extends PageData {
    frontmatter: PostFrontmatter
    filePath: string
    /** Word count of the post body, added by `addReadingTime`. */
    wordCount?: number
    /** Estimated reading time in whole minutes, added by `addReadingTime`. */
    readingMinutes?: number
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
 * accessible at runtime via `useThemeConfig()`. Known Neptu fields keep
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
export type I18nTranslations = NeptuBlogTheme.I18nTranslations
export type LocaleDefinition = NeptuBlogTheme.LocaleDefinition
export type ExtendedPageData = NeptuBlogTheme.ExtendedPageData
export type ExtendedSiteConfig = NeptuBlogTheme.ExtendedSiteConfig
export type BlogUserConfig = NeptuBlogTheme.BlogUserConfig
export type SeoConfig = NeptuBlogTheme.SeoConfig
export type NavConfig = NeptuBlogTheme.NavConfig
export type SidebarConfig = NeptuBlogTheme.SidebarConfig
export type SidebarItem = NeptuBlogTheme.SidebarItem
export type TaxonomyEntry = NeptuBlogTheme.TaxonomyEntry
export type BreadcrumbItem = NeptuBlogTheme.BreadcrumbItem
export type AuthorItem = NeptuBlogTheme.AuthorItem
export type SocialLinkItem = NeptuBlogTheme.SocialLinkItem
export type LinkItem = NeptuBlogTheme.LinkItem
export type SocialLink = NeptuBlogTheme.SocialLink
export type SocialMediaShare = NeptuBlogTheme.SocialMediaShare
export type TocConfig = NeptuBlogTheme.TocConfig
export type AdsConfig = NeptuBlogTheme.AdsConfig
export type ReadingTimeConfig = NeptuBlogTheme.ReadingTimeConfig
export type DraftsConfig = NeptuBlogTheme.DraftsConfig
export type HomeConfig = NeptuBlogTheme.HomeConfig
export type HomeSectionConfig = NeptuBlogTheme.HomeSectionConfig
export type SidebarLogo = NeptuBlogTheme.SidebarLogo
export type ConsentConfig = NeptuBlogTheme.ConsentConfig
export type ConsentState = NeptuBlogTheme.ConsentState
export type ResolvedBlogConfig = NeptuBlogTheme.ResolvedBlogConfig
export type NavLink = NeptuBlogTheme.NavLink
export type DonateConfig = NeptuBlogTheme.DonateConfig
export type AuthorLink = NeptuBlogTheme.AuthorLink
export type AuthorBase = NeptuBlogTheme.AuthorBase
export type BaseLink = NeptuBlogTheme.BaseLink
export type BlogLocaleConfig = NeptuBlogTheme.BlogLocaleConfig
export type PostListConfig = NeptuBlogTheme.PostListConfig
export type FeedsConfig = NeptuBlogTheme.FeedsConfig
export type SearchConfig = NeptuBlogTheme.SearchConfig
export type PublisherConfig = NeptuBlogTheme.PublisherConfig
export type FooterConfig = NeptuBlogTheme.FooterConfig
export type SearchUIConfig = NeptuBlogTheme.SearchUIConfig
export type SearchUIFooter = NeptuBlogTheme.SearchUIFooter
export type I18nLinks = NeptuBlogTheme.I18nLinks
export type InContentAdsConfig = NeptuBlogTheme.InContentAdsConfig
export type HomeBackgroundConfig = NeptuBlogTheme.HomeBackgroundConfig
export type HomeHeroImage = NeptuBlogTheme.HomeHeroImage
export type HomeHeroConfig = NeptuBlogTheme.HomeHeroConfig
export type HomeSectionType = NeptuBlogTheme.HomeSectionType
export type HomeActionConfig = NeptuBlogTheme.HomeActionConfig
export type PopularPostsConfig = NeptuBlogTheme.PopularPostsConfig
export type AnalyticsDataSource = NeptuBlogTheme.AnalyticsDataSource

declare const theme: Theme
export default theme
