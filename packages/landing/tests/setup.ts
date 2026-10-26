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

class MockStorage implements Storage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys())
    return keys[index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }
}

const mockStorage = new MockStorage()

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  configurable: true,
  writable: true,
})
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    configurable: true,
    writable: true,
  })
}

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
      title: ref('Test Page'),
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
  mockSite.value = { locales: {}, cleanUrls: true }
  mockStorage.clear()
})
