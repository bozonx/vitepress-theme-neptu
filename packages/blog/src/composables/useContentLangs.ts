import { useData, type SiteData } from 'vitepress'
import { computed } from 'vue'
import type { NeptuBlogTheme } from '../types.d.ts'
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
  code: string
}

interface LocaleSpecificConfig {
  label: string
  lang?: string
  dir?: string
}

interface SitePageRef {
  relativePath?: string
}

function ensureStartingSlash(path: string): string {
  return /^\.\//.test(path) || /^\w+:/.test(path) || path.startsWith('/') ? path : `/${path}`
}

function normalizeLink(
  link: string,
  addPath: boolean,
  path: string,
  addHtmlExtension: boolean
): string {
  if (!addPath) return link

  const normalizedPath = path
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, addHtmlExtension ? '.html' : '')

  return link.replace(/\/$/, '') + ensureStartingSlash(normalizedPath)
}

export function useContentLangs(options: { correspondingLink?: boolean } = {}) {
  const { correspondingLink = false } = options
  const { site, localeIndex, page, theme, hash } = useData<NeptuBlogTheme.Config>()

  const currentLang = computed<CurrentLang>(() => {
    const currentLocale = site.value.locales[localeIndex.value] as LocaleSpecificConfig | undefined

    return {
      label: currentLocale?.label,
      link: `/${localeIndex.value}/`,
      code: localeIndex.value,
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
        const localeRelativePath = pickExistingTranslationRelativePath(
          resolveTranslationRelativePathCandidates(page.value.relativePath, key, translations),
          { knownRelativePaths }
        )
        if (!localeRelativePath) return []

        const relativePath = localeRelativePath.slice(localeBaseLink.length - 1)

        return {
          text: value.label,
          link:
            normalizeLink(
              localeBaseLink,
              theme.value.i18nRouting !== false && correspondingLink,
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
