import fs from 'node:fs/promises'
import path from 'node:path'

import { POSTS_DIR } from '../constants.ts'
import {
  mergeWithAnalytics,
  type AnalyticsDataSource,
} from './loadPostsStats.ts'
import { makePreviewItem } from './makePreviewItem.ts'
import {
  areDraftsVisibleByDefault,
  shouldListPost,
} from '../utils/shared/publication.ts'
import type { Post } from '../types.d.ts'

const POSTS_CACHE_KEY = '__neptuBlogCache__'

function getDefaultCache(): Record<string, Post[]> {
  const globalObj = globalThis as Record<string, unknown>
  if (!globalObj[POSTS_CACHE_KEY]) globalObj[POSTS_CACHE_KEY] = {}
  return globalObj[POSTS_CACHE_KEY] as Record<string, Post[]>
}

export interface LoadPostsOptions {
  popularPostsEnabled?: boolean
  dataSource?: AnalyticsDataSource | null
  ignoreCache?: boolean
  /** Cache store for dependency injection. Falls back to the global singleton. */
  cache?: Record<string, Post[]>
  maxPreviewLength?: number
  /** Posts subdirectory name inside each locale dir. Defaults to `POSTS_DIR` ("posts"). */
  postsDir?: string
  /** Absolute path to srcDir. Passed to makePreviewItem to avoid hardcoded depth assumption. */
  srcDir?: string
  /** Words per minute for the reading-time estimate. Defaults to 200. */
  readingWpm?: number
  /**
   * Keep `draft: true` posts in the result. Defaults to
   * {@link areDraftsVisibleByDefault} — on in `vitepress dev`, off in a
   * production build.
   */
  showDrafts?: boolean
}

/**
 * Drafts are dropped after the previews are built, so the cache key stays
 * independent of the flag and the frontmatter is available for the check.
 */
function applyVisibility(posts: Post[], showDrafts: boolean): Post[] {
  if (showDrafts) return posts

  return posts.filter((post) => shouldListPost(post.frontmatter))
}

/** Loads all posts from the `<localeDir>/posts` directory. */
export async function loadPostsData(
  localeDir: string,
  options: LoadPostsOptions = {}
): Promise<Post[]> {
  const {
    popularPostsEnabled = false,
    dataSource = null,
    ignoreCache = false,
    cache: cacheOpt,
    postsDir: postsDirName = POSTS_DIR,
    srcDir: srcDirOpt,
    showDrafts = areDraftsVisibleByDefault(),
  } = options
  const localeIndex = path.basename(localeDir)

  if (!localeIndex) return []

  const srcDir = srcDirOpt ?? path.dirname(localeDir)
  const postsDir = path.join(localeDir, postsDirName)
  const cacheKey = path.resolve(postsDir)
  const cache = cacheOpt ?? getDefaultCache()

  if (cache[cacheKey] && !ignoreCache) {
    return cache[cacheKey]!
  }

  try {
    // Recursive: posts may live in subfolders — a folder per article
    // (`posts/my-article/index.md`) or any deeper grouping.
    const files = await fs.readdir(postsDir, { recursive: true })
    const mdFiles = files.filter((file) => file.endsWith('.md')).sort()
    const fullPaths = mdFiles.map((file) => path.join(postsDir, file))
    const posts = applyVisibility(
      fullPaths.map((filePath) =>
        makePreviewItem(filePath, {
          maxPreviewLength: options.maxPreviewLength,
          readingWpm: options.readingWpm,
          srcDir,
        })
      ) as Post[],
      showDrafts
    )

    cache[cacheKey] = posts

    if (popularPostsEnabled && dataSource) {
      cache[cacheKey] = await mergeWithAnalytics(posts, dataSource)
    }

    return cache[cacheKey]!
  } catch (error) {
    throw new Error(
      `Error loading posts for locale ${localeIndex}: ${(error as Error).message}`,
      { cause: error }
    )
  }
}

/**
 * Derives `srcDir` from a post path by locating the posts directory:
 * `<srcDir>/<locale>/<postsDir>/…/article.md`.
   * Lets nested posts (`posts/my-article/index.md`) resolve their locale and URL
 * without the caller having to pass `srcDir` explicitly.
 */
function inferSrcDir(filePath: string, postsDirName: string): string | undefined {
  const segments = filePath.split(path.sep)
  const postsIndex = segments.lastIndexOf(postsDirName)

  // Needs at least `<srcDir>/<locale>/<postsDir>` before the file name.
  if (postsIndex < 2) return undefined

  return segments.slice(0, postsIndex - 1).join(path.sep)
}

export async function loadPostsDataFromFiles(
  files: string[],
  options: LoadPostsOptions = {}
): Promise<Post[]> {
  const {
    popularPostsEnabled = false,
    dataSource = null,
    ignoreCache = false,
    cache: cacheOpt,
    postsDir: postsDirName = POSTS_DIR,
    srcDir,
    showDrafts = areDraftsVisibleByDefault(),
  } = options
  const fullPaths = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.resolve(file))
    .sort()
  const cacheKey = fullPaths.length > 0
    ? `${fullPaths.length}:${fullPaths[0]}${fullPaths.length > 1 ? `:${fullPaths[fullPaths.length - 1]}` : ''}`
    : ''
  const cache = cacheOpt ?? getDefaultCache()

  if (!fullPaths.length) return []

  if (cache[cacheKey] && !ignoreCache) {
    return cache[cacheKey]!
  }

  try {
    const posts = applyVisibility(
      fullPaths.map((filePath) =>
        makePreviewItem(filePath, {
          maxPreviewLength: options.maxPreviewLength,
          readingWpm: options.readingWpm,
          srcDir: srcDir ?? inferSrcDir(filePath, postsDirName),
        })
      ) as Post[],
      showDrafts
    )

    cache[cacheKey] = posts

    if (popularPostsEnabled && dataSource) {
      cache[cacheKey] = await mergeWithAnalytics(posts, dataSource)
    }

    return cache[cacheKey]!
  } catch (error) {
    throw new Error(
      `Error loading posts from watched files: ${(error as Error).message}`,
      { cause: error }
    )
  }
}
