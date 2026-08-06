import { ref } from 'vue'

export const mockTheme = ref<Record<string, unknown>>({
  heroImage: '/img/home-logo.svg',
  externalLinkIcon: true,
  i18nRouting: true,
  t: {
    donate: 'Donate',
    toBlog: 'Go to blog',
  },
})

export const mockLocaleIndex = ref<string>('en')
export const mockRoute = ref<{ path: string }>({ path: '/en/' })
export const mockPage = ref<{ relativePath: string; title: string }>({
  relativePath: 'en/index.md',
  title: 'Landing',
})
export const mockFrontmatter = ref<Record<string, unknown>>({})
export const mockIsDark = ref<boolean>(false)
export const mockSite = ref<{ locales: Record<string, unknown>; cleanUrls: boolean; base?: string }>({ locales: {}, cleanUrls: true })
export const mockHash = ref<string>('')
