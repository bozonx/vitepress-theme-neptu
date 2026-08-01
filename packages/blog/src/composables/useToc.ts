import { inBrowser, useData, useRoute } from 'vitepress'
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue'

import {
  flattenTocHeaders,
  hasEnoughHeadings,
  isTocEnabled,
  resolveTocLevels,
  type TocHeader,
  type TocItem,
} from '../utils/shared/toc.ts'
import type { PostFrontmatter, ThemeConfig } from '../types.d.ts'

/**
 * Resolve the table of contents for the current page.
 *
 * Headings come from `page.headers`, which VitePress builds at compile time
 * from the same slugs it puts on the anchors — so the links always match the
 * rendered DOM without scraping it.
 */
export function useToc(): {
  items: ComputedRef<TocItem[]>
  /** True when the TOC is enabled *and* clears the heading-count threshold. */
  show: ComputedRef<boolean>
  label: ComputedRef<string>
} {
  const { page, frontmatter, theme } = useData<ThemeConfig>()

  const items = computed(() => {
    if (!isTocEnabled(theme.value, frontmatter.value as PostFrontmatter)) {
      return []
    }

    return flattenTocHeaders(
      page.value.headers as TocHeader[] | undefined,
      resolveTocLevels(theme.value?.toc?.level)
    )
  })

  const show = computed(
    () => items.value.length > 0 && hasEnoughHeadings(items.value.length, theme.value)
  )

  const label = computed(
    () => theme.value?.toc?.label || theme.value?.t?.tocLabel || 'On this page'
  )

  return { items, show, label }
}

/**
 * Track which heading the reader is currently in, for highlighting the TOC.
 *
 * Uses scroll position rather than `IntersectionObserver`: the active entry
 * has to be the last heading *above* the reading line, and an observer only
 * reports headings that are on screen — which leaves nothing highlighted
 * while the reader is in the middle of a long section.
 */
export function useActiveHeading(
  items: Ref<TocItem[]> | ComputedRef<TocItem[]>,
  /** Distance from the viewport top that counts as the reading line. */
  offset = 120
): { activeLink: Ref<string> } {
  const route = useRoute()
  const activeLink = ref('')
  let frame = 0

  function update(): void {
    if (!inBrowser || !items.value.length) return

    // Above the first heading nothing is active; at the very bottom the last
    // entry wins even if its heading never crosses the reading line.
    const scrollY = window.scrollY
    const atBottom =
      scrollY + window.innerHeight >= document.body.scrollHeight - 2

    if (atBottom) {
      activeLink.value = items.value[items.value.length - 1].link
      return
    }

    let current = ''

    for (const item of items.value) {
      const el = document.getElementById(decodeURIComponent(item.link.slice(1)))
      if (!el) continue

      if (el.getBoundingClientRect().top - offset <= 0) {
        current = item.link
      } else {
        break
      }
    }

    activeLink.value = current
  }

  function onScroll(): void {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      update()
    })
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onUnmounted(() => {
    if (!inBrowser) return
    if (frame) cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  // Anchors are only in the DOM after the new page renders, so recompute on
  // navigation instead of carrying the previous page's active entry over.
  watch(
    () => route.path,
    () => {
      activeLink.value = ''
      if (inBrowser) requestAnimationFrame(update)
    }
  )

  return { activeLink }
}
