import { ref } from 'vue'

export const mockTheme = ref<any>({
  perPage: 10,
  paginationMaxItems: 7,
  t: {
    paginationToStart: 'To start',
    paginationToEnd: 'To end',
    tagBadgeCount: 'Posts count',
    postsCountForms: ['post', 'posts', 'posts'],
    links: { recent: 'Recent', popular: 'Popular' },
  },
  popularPosts: { enabled: false },
  postFooter: [
    'author',
    'donate',
    'comments',
    'social-share',
    'edit-link',
    'tags',
    'similar',
    'popular-link',
  ],
  externalLinkIcon: true,
  postList: {
    showDate: true,
    showTags: true,
    showThumbnail: true,
    showPreview: true,
    showAuthor: true,
  },
})

export const mockLocaleIndex = ref<any>('en')
export const mockRoute = ref<any>({ path: '/en/blog/1' })
export const mockPage = ref<any>({
  relativePath: 'posts/hello.md',
  title: 'Hello',
})
export const mockFrontmatter = ref<any>({})
export const mockIsDark = ref<any>(false)
export const mockSite = ref<any>({ locales: {}, cleanUrls: true })
export const mockHash = ref<any>('')

