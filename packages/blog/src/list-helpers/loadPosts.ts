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

/**
 * Identity of the analytics enrichment, for the cache key.
 *
 * Posts loaded with analytics carry an extra `analyticsStats` field, so they
 * are a different result and must not be served from an entry produced without
 * it. Credentials are deliberately excluded — they do not change the shape of
 * the result and have no business sitting in a cache key.
 */
function analyticsCacheIdentity(
  popularPostsEnabled: boolean,
  dataSource: AnalyticsDataSource | null | undefined
): unknown {
  if (!popularPostsEnabled || !dataSource) return null

  return [
    dataSource.provider,
    dataSource.propertyId ?? null,
    dataSource.dataPeriodDays ?? null,
    dataSource.dataLimit ?? null,
  ]
}

/**
 * Builds the previews, applies analytics, and only then publishes the result to
 * the cache — a half-built entry must never become visible to a concurrent
 * caller.
 */
async function buildAndCache(
  filePaths: string[],
  cache: Record<string, Post[]>,
  cacheKey: string,
  options: LoadPostsOptions,
  resolveSrcDir: (filePath: string) => string | undefined,
  showDrafts: boolean
): Promise<Post[]> {
  const { popularPostsEnabled = false, dataSource = null } = options

  let posts = applyVisibility(
    filePaths.map((filePath) =>
      makePreviewItem(filePath, {
        maxPreviewLength: options.maxPreviewLength,
        readingWpm: options.readingWpm,
        srcDir: resolveSrcDir(filePath),
      })
    ) as Post[],
    showDrafts
  )

  if (popularPostsEnabled && dataSource) {
    posts = await mergeWithAnalytics(posts, dataSource)
  }

  cache[cacheKey] = posts

  return posts
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
  const cacheKey = JSON.stringify([
    path.resolve(postsDir),
    showDrafts,
    options.maxPreviewLength,
    options.readingWpm,
    srcDir,
    postsDirName,
    analyticsCacheIdentity(popularPostsEnabled, dataSource),
  ])
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

    return await buildAndCache(
      fullPaths,
      cache,
      cacheKey,
      options,
      () => srcDir,
      showDrafts
    )
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
  const normalized = path.normalize(filePath)
  const segments = normalized.split(path.sep)
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
  const cacheKey = JSON.stringify([
    fullPaths,
    showDrafts,
    options.maxPreviewLength,
    options.readingWpm,
    srcDir,
    postsDirName,
    analyticsCacheIdentity(popularPostsEnabled, dataSource),
  ])
  const cache = cacheOpt ?? getDefaultCache()

  if (!fullPaths.length) return []

  if (cache[cacheKey] && !ignoreCache) {
    return cache[cacheKey]!
  }

  try {
    return await buildAndCache(
      fullPaths,
      cache,
      cacheKey,
      options,
      (filePath) => srcDir ?? inferSrcDir(filePath, postsDirName),
      showDrafts
    )
  } catch (error) {
    throw new Error(
      `Error loading posts from watched files: ${(error as Error).message}`,
      { cause: error }
    )
  }
}
