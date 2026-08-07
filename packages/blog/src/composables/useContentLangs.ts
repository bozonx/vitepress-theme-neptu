import { useData, type SiteData } from 'vitepress'
import { computed, inject } from 'vue'
import type { CategoryDefinition, NeptuBlogTheme, PostLite } from '../types.d.ts'
import {
  getFrontmatterTranslations,
  pickExistingTranslationRelativePath,
  resolveTranslationRelativePathCandidates,
} from '../utils/shared/index.ts'
import { TRANSLATION_LINKS_KEY } from '../transformers/resolveTranslationLinks.ts'

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
 * The list routes the theme generates from posts rather than from files.
 *
 * They are the reason this module needs a second resolution strategy at all:
 * `tags/[slug]/[page].md` is one physical file shared by every locale, so the
 * "does the translated file exist?" check that maps ordinary pages always
 * succeeds — even when the route itself was never generated for the target
 * locale, which is how a language switcher ends up pointing at a 404.
 */
const LIST_ROUTE_KINDS = [
  'recent',
  'popular',
  'featured',
  'archive',
  'authors',
  'tags',
  'categories',
] as const

type ListRouteKind = (typeof LIST_ROUTE_KINDS)[number]

function getYear(date: PostLite['date']): number | undefined {
  if (!date) return undefined
  const year = new Date(date).getUTCFullYear()
  return Number.isFinite(year) ? year : undefined
}

/**
 * Whether the target locale generates any page for this list at all.
 *
 * Route params are not consulted for the page number on purpose — see
 * {@link resolveListRouteLocalePath}.
 */
function targetHasPosts(
  kind: ListRouteKind,
  params: Record<string, unknown>,
  posts: PostLite[],
  categoryId: string | undefined
): boolean {
  switch (kind) {
    case 'recent':
    case 'popular':
      return posts.length > 0
    case 'featured':
      return posts.some((post) => post.featured === true)
    case 'archive': {
      const year = Number(params.year)
      const month = params.month === undefined ? undefined : Number(params.month)
      return posts.some((post) => {
        if (getYear(post.date) !== year) return false
        if (month === undefined) return true
        return new Date(post.date as string).getUTCMonth() + 1 === month
      })
    }
    case 'authors':
      return posts.some((post) => post.authorId === params.id)
    case 'tags':
      return posts.some((post) =>
        post.tags?.some((item) => item?.slug === params.slug)
      )
    case 'categories':
      return posts.some((post) =>
        post.categories?.some((item) => item?.id === categoryId)
      )
  }
}

/**
 * Maps a generated list route onto the equivalent route in another locale.
 *
 * Two rules make this work without knowing how either locale paginates:
 *
 *  - **Always land on page 1.** The reader asked for another language, not for
 *    the same offset into a different set of posts — and page 3 of a list that
 *    is one page long in the target locale does not exist.
 *  - **Only link when the list is non-empty there.** These routes exist only
 *    where posts put them, so an empty list means there is nowhere to land.
 *
 * Identity across locales differs per taxonomy: a category is matched by the
 * `id` from `_categories.yaml` (its slug may be translated), while a tag is
 * matched by its slug, which is all the identity a tag has.
 *
 * Returns undefined when the page is not a list route, or when the target
 * locale has no such page — the caller then emits no link rather than falling
 * back to the file-path match, which cannot be trusted here.
 */
function resolveListRouteLocalePath(
  relativePath: string | undefined,
  routeParams: Record<string, unknown> | undefined,
  targetLocaleTheme: NeptuBlogTheme.Config | undefined,
  targetLocalePosts: PostLite[] | undefined
): string | undefined {
  if (!relativePath || !routeParams) return undefined

  const segments = relativePath.replace(/\.md$/, '').split('/')
  const kind = segments[1] as ListRouteKind | undefined
  if (!kind || !LIST_ROUTE_KINDS.includes(kind)) return undefined

  // A blog opts out of a section by deleting its directory, so the target
  // locale may not build this kind of list at all — no amount of posts there
  // would make the route exist.
  const sections = targetLocaleTheme?.listSections
  if (sections && !sections.includes(kind)) return undefined

  // `<locale>/<kind>/<key>/popular/<page>` — keep the reader on the popular
  // variant of the list they were looking at.
  const popular = segments[3] === 'popular' ? ['popular'] : []

  let target: string[]

  if (kind === 'categories') {
    const categoryId = routeParams.id as string | undefined
    const registry = targetLocaleTheme?.categories as CategoryDefinition[] | undefined
    const entry = registry?.find((item) => item?.id === categoryId)
    if (!entry) return undefined
    target = ['categories', entry.slug || entry.id, ...popular, '1']
  } else if (kind === 'tags') {
    if (!routeParams.slug) return undefined
    target = ['tags', String(routeParams.slug), ...popular, '1']
  } else if (kind === 'authors') {
    if (!routeParams.id) return undefined
    target = ['authors', String(routeParams.id), ...popular, '1']
  } else if (kind === 'archive') {
    if (!routeParams.year) return undefined
    target =
      routeParams.month === undefined
        ? ['archive', String(routeParams.year), ...popular, '1']
        : ['archive', String(routeParams.year), 'month', String(routeParams.month)]
  } else {
    target = [kind, '1']
  }

  // Without the post index there is nothing to verify against. Keep the link:
  // it is still better targeted than the file-path fallback would be.
  if (
    targetLocalePosts &&
    !targetHasPosts(
      kind,
      routeParams,
      targetLocalePosts,
      routeParams.id as string | undefined
    )
  ) {
    return undefined
  }

  return target.join('/')
}

export function useContentLangs(options: { correspondingLink?: boolean } = {}) {
  const { correspondingLink = false } = options
  const { site, localeIndex, page, theme, hash, params } =
    useData<NeptuBlogTheme.Config>()
  // Provided by the app Layout. Used to check that a generated list page
  // actually exists in the target locale.
  const allPosts = inject<Record<string, PostLite[]> | undefined>('posts', undefined)

  // Route params exist only on dynamic routes, which is exactly what separates
  // a generated list page from `tags/index.md` and friends — those are ordinary
  // files and map across locales by path.
  const listRouteParams = computed(() => {
    const routeParams = params?.value as Record<string, unknown> | undefined
    if (!routeParams || Object.keys(routeParams).length === 0) return undefined

    const kind = (page.value.relativePath || '').split('/')[1] as ListRouteKind
    return LIST_ROUTE_KINDS.includes(kind) ? routeParams : undefined
  })

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
    // Resolved at build time against the filesystem — the only source here that
    // is complete in a production bundle. `site.pages` exists in dev only, and
    // without it `pickExistingTranslationRelativePath` accepts every candidate
    // unchecked, which is what used to offer every locale on every page.
    const resolvedTranslations = page.value.frontmatter?.[
      TRANSLATION_LINKS_KEY
    ] as Record<string, string> | undefined

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

        // Generated list routes resolve here or not at all. The file-path
        // fallback below cannot help them: `[slug]/[page].md` is the same file
        // in every locale, so it would happily point at a route that was never
        // generated for this one.
        if (listRouteParams.value) {
          const listPath = resolveListRouteLocalePath(
            page.value.relativePath,
            listRouteParams.value,
            value.themeConfig as NeptuBlogTheme.Config | undefined,
            allPosts?.[key]
          )
          if (!listPath) return []

          return {
            text: value.label,
            link:
              buildLocaleLink(
                localeBaseLink,
                correspondingLink,
                // `buildLocaleLink` speaks relative *paths* — it strips `.md`
                // and re-adds `.html` when clean URLs are off.
                `${listPath}.md`,
                !site.value.cleanUrls
              ) + hash.value,
            lang: value.lang,
            dir: value.dir,
          }
        }

        const localeRelativePath = resolvedTranslations
          ? resolvedTranslations[key]
          : pickExistingTranslationRelativePath(
              resolveTranslationRelativePathCandidates(
                page.value.relativePath,
                key,
                translations
              ),
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
