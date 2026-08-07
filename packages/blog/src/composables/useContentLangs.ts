import { useData, type SiteData } from 'vitepress'
import { computed, inject } from 'vue'
import type { CategoryDefinition, NeptuBlogTheme, PostLite } from '../types.d.ts'
import {
  getFrontmatterTranslations,
  pickExistingTranslationRelativePath,
  resolveTranslationRelativePathCandidates,
} from '../utils/shared/index.ts'

interface LocaleLink {
  text: string
  link: string
  lang?: string
  dir?: string
}

interface CurrentLang {
  label?: string
  link: string
  locale: string
}

interface LocaleSpecificConfig {
  label: string
  lang?: string
  dir?: string
}

interface SitePageRef {
  relativePath?: string
}

function ensureLeadingSlash(path: string): string {
  if (path.startsWith('./') || path.startsWith('/') || /^\w+:/.test(path)) return path
  return `/${path}`
}

function buildLocaleLink(
  link: string,
  addPath: boolean,
  path: string,
  addHtmlExtension: boolean
): string {
  if (!addPath) return link

  const normalizedPath = path
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, addHtmlExtension ? '.html' : '')

  return link.replace(/\/$/, '') + ensureLeadingSlash(normalizedPath)
}

/**
 * Category pages live on a dynamic route (`categories/[slug]/[page].md`), so
 * there is no per-locale source file to match on the way `useContentLangs`
 * matches ordinary pages. Instead the route carries the category `id`, which is
 * the same in every locale, and each locale's registry says which slug that id
 * uses there.
 *
 * Returns undefined for every other kind of page, and whenever the target
 * locale would not have a page to land on — the category route only exists
 * where at least one post uses it, so a declared-but-unused category must not
 * produce a link.
 */
function resolveCategoryLocalePath(
  relativePath: string | undefined,
  categoryId: string | undefined,
  targetLocaleTheme: NeptuBlogTheme.Config | undefined,
  targetLocalePosts: PostLite[] | undefined
): string | undefined {
  if (!categoryId || !relativePath) return undefined

  const segments = relativePath.replace(/\.md$/, '').split('/')
  // `<locale>/categories/<slug>/…`
  if (segments[1] !== 'categories' || segments.length < 3) return undefined

  const registry = targetLocaleTheme?.categories as CategoryDefinition[] | undefined
  const entry = registry?.find((item) => item?.id === categoryId)
  if (!entry) return undefined

  // Without the post index there is nothing to verify against, so trust the
  // registry rather than dropping a link that is probably fine.
  if (
    targetLocalePosts &&
    !targetLocalePosts.some((post) =>
      post.categories?.some((item) => item?.id === categoryId)
    )
  ) {
    return undefined
  }

  const targetSlug = entry.slug || entry.id
  // Keep whatever follows the slug — `popular/2` stays `popular/2`.
  const rest = segments.slice(3)

  return ['categories', targetSlug, ...rest].join('/')
}

export function useContentLangs(options: { correspondingLink?: boolean } = {}) {
  const { correspondingLink = false } = options
  const { site, localeIndex, page, theme, hash, params } =
    useData<NeptuBlogTheme.Config>()
  // Provided by the app Layout. Used only to check that a category page
  // actually exists in the target locale.
  const allPosts = inject<Record<string, PostLite[]> | undefined>('posts', undefined)

  // A single category's paginated route, as opposed to `categories/index.md`
  // — that one is an ordinary file and maps across locales by path.
  const isCategoryRoute = computed(
    () =>
      (page.value.relativePath || '').split('/')[1] === 'categories' &&
      !!params?.value?.id
  )

  const currentLang = computed<CurrentLang>(() => {
    const currentLocale = site.value.locales[localeIndex.value] as LocaleSpecificConfig | undefined

    return {
      label: currentLocale?.label,
      link: `/${localeIndex.value}/`,
      locale: localeIndex.value,
    }
  })

  const localeLinks = computed<LocaleLink[]>(() => {
    const knownPages = (site.value as SiteData<NeptuBlogTheme.Config> & { pages?: SitePageRef[] }).pages
    const translations = getFrontmatterTranslations(page.value.frontmatter)
    const knownRelativePaths = knownPages?.flatMap((sitePage) =>
      sitePage.relativePath ? [sitePage.relativePath] : []
    )

    return Object.entries(
      site.value.locales as SiteData<NeptuBlogTheme.Config>['locales']
    ).flatMap(
      ([key, value]) => {
        if (key === localeIndex.value) {
          return []
        }

        const localeBaseLink = `/${key}/`

        // When i18nRouting is disabled, always link to the locale root
        // without checking for translation file existence
        if (theme.value.i18nRouting === false) {
          return {
            text: value.label,
            link: localeBaseLink + hash.value,
            lang: value.lang,
            dir: value.dir,
          }
        }

        // Dynamic category routes map across locales by id, not by file path.
        // The file-path fallback below cannot help here: `[slug]/[page].md` is
        // the same file in every locale, so it would happily point at a route
        // that was never generated. Category pages resolve here or not at all.
        if (isCategoryRoute.value) {
          const categoryPath = resolveCategoryLocalePath(
            page.value.relativePath,
            // `params` is only populated on dynamic routes.
            params?.value?.id as string | undefined,
            value.themeConfig as NeptuBlogTheme.Config | undefined,
            allPosts?.[key]
          )
          if (!categoryPath) return []

          return {
            text: value.label,
            link:
              buildLocaleLink(
                localeBaseLink,
                correspondingLink,
                // `buildLocaleLink` speaks relative *paths* — it strips `.md`
                // and re-adds `.html` when clean URLs are off.
                `${categoryPath}.md`,
                !site.value.cleanUrls
              ) + hash.value,
            lang: value.lang,
            dir: value.dir,
          }
        }

        const localeRelativePath = pickExistingTranslationRelativePath(
          resolveTranslationRelativePathCandidates(page.value.relativePath, key, translations),
          { knownRelativePaths }
        )
        if (!localeRelativePath) return []

        const relativePath = localeRelativePath.slice(localeBaseLink.length - 1)

        return {
          text: value.label,
          link:
            buildLocaleLink(
              localeBaseLink,
              correspondingLink,
              relativePath,
              !site.value.cleanUrls
            ) + hash.value,
          lang: value.lang,
          dir: value.dir,
        }
      }
    )
  })

  return {
    currentLang,
    localeLinks,
  }
}
