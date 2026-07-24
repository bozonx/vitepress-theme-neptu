import { vi, afterEach } from 'vitest'
import { ref } from 'vue'
import {
  mockTheme,
  mockLocaleIndex,
  mockRoute,
  mockPage,
  mockFrontmatter,
  mockIsDark,
  mockSite,
  mockHash,
} from './mocks/vitepress'

vi.mock('vitepress', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vitepress')>()
  return {
    ...actual,
    inBrowser: true,
    withBase: (path: string) => {
      if (!path || typeof path !== 'string' || !path.startsWith('/')) return path
      const base = (mockSite.value?.base || '/').replace(/\/+$/, '')
      return base ? `${base}${path}` : path
    },
    useData: () => ({
      site: mockSite,
      theme: mockTheme,
      localeIndex: mockLocaleIndex,
      page: mockPage,
      frontmatter: mockFrontmatter,
      isDark: mockIsDark,
      hash: mockHash,
      lang: 'en',
      title: ref('Test Post'),
    }),
    useRoute: () => mockRoute.value,
  }
})

vi.mock('@iconify/vue', () => ({
  Icon: {
    name: 'Icon',
    props: ['icon'],
    template: '<i class="iconify-stub" :data-icon="icon" />',
  },
  addCollection: () => true,
}))

afterEach(() => {
  document.body.innerHTML = ''
})
