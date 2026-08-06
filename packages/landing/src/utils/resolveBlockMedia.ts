import { resolveContentMediaPath } from 'vitepress-theme-neptu/utils'

/**
 * Rewrites co-located media paths inside landing block data to site-root
 * paths, so `image: ./media/hero.svg` in `ru/pages/pricing/index.md` becomes
 * `/ru/pages/pricing/media/hero.svg`.
 *
 * Block values are plain frontmatter strings rendered by Vue components, so
 * Vite never resolves them the way it resolves Markdown body images. Only
 * explicitly relative values (`./…`, `../…`) are touched — icon names such as
 * `fa6-solid:bolt` and site-root paths stay as they are.
 */
export function resolveBlockMedia(
  value: unknown,
  mdRelativePath: string | undefined
): unknown {
  if (!mdRelativePath) return value

  if (Array.isArray(value)) {
    return value.map((item) => resolveBlockMedia(item, mdRelativePath))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        resolveBlockMedia(item, mdRelativePath),
      ])
    )
  }

  return resolveContentMediaPath(value, mdRelativePath)
}
