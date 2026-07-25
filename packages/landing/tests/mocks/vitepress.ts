import { ref } from 'vue'

export const mockTheme = ref<any>({
  mainHeroImg: '/img/home-logo.svg',
  blogUrl: 'https://blog.example.com',
  externalLinkIcon: true,
  i18nRouting: true,
  t: {
    donate: 'Donate',
    toBlog: 'Go to blog',
  },
})

export const mockLocaleIndex = ref<any>('en')
export const mockRoute = ref<any>({ path: '/en/' })
export const mockPage = ref<any>({
  relativePath: 'en/index.md',
  title: 'Landing',
})
export const mockFrontmatter = ref<any>({})
export const mockIsDark = ref<any>(false)
export const mockSite = ref<any>({ locales: {}, cleanUrls: true })
export const mockHash = ref<any>('')
