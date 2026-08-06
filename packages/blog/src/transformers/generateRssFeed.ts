import { Feed } from 'feed'
import fs from 'node:fs'
import path from 'node:path'
import { createContentLoader } from 'vitepress'

import { DEFAULT_ENCODING, POSTS_DIR } from '../constants.ts'
import { extractDescriptionFromMd, mdToFeedHtml, parseMdFile } from '../utils/node/index.ts'
import {
  createPostGuid,
  formatTagsForRss,
  getFeedPath,
  getFeedUrl,
  getRssFormatInfo,
  resolveRssFormats,
  makeAuthorForRss,
  validatePostForRss,
  validateRssConfig,
} from '../utils/node/index.ts'
import { makeAbsoluteUrl, normalizeSiteUrl } from '../utils/shared/url.ts'
import { resolveContentMediaPath, resolveSidebarLogo } from '../utils/shared/media.ts'
import { isPostVisible, resolveShowDrafts } from '../utils/shared/publication.ts'
import type { ExtendedSiteConfig, PostFrontmatter, Author } from '../types.d.ts'

/**
 * Rebuilds the Markdown path of a post from its route, so co-located media
 * paths can be resolved against the post's own folder.
 *
 * `/ru/posts/my-article/` → `ru/posts/my-article/index.md`
 */
function mdPathFromUrl(url: string): string {
  const clean = url.replace(/^\//, '')

  return clean.endsWith('/') ? `${clean}index.md` : `${clean}.md`
}

/**
 * Generates RSS and Atom feeds for all locales.
 * pageData.description must be resolved before this transformer runs.
 */
export async function generateRssFeed(config: ExtendedSiteConfig): Promise<void> {
  try {
    if (!validateRssConfig(config)) {
      throw new Error('Invalid RSS configuration')
    }

    const feeds: Record<string, Feed> = {}
    const siteUrl = normalizeSiteUrl(config.userConfig!.siteUrl!)!
    const rssFormats = resolveRssFormats(config)
    const generationErrors: Error[] = []

    for (const localeIndex of Object.keys(config.site!.locales!)) {
      const locale = config.site!.locales![localeIndex]!
      const localeSiteUrl = `${siteUrl}/${localeIndex}`
      const feedLinks = Object.fromEntries(
        rssFormats
          .filter((format) => format === 'rss' || format === 'atom')
          .map((format) => [format, getFeedUrl(siteUrl, localeIndex, format)])
      )

      const defaultFavicon = `${siteUrl}/img/favicon-32x32.png`

      feeds[localeIndex] = new Feed({
        language: locale.lang || localeIndex,
        title: locale.title || '',
        description: locale.description || '',
        copyright: locale.themeConfig?.footer?.copyright || '',
        id: localeSiteUrl,
        link: localeSiteUrl,
        favicon: defaultFavicon,
        // A feed reader has no appearance of its own, so the light variant of
        // a per-appearance logo is the one that ships.
        image:
          makeAbsoluteUrl(
            siteUrl,
            resolveSidebarLogo(
              locale.themeConfig?.sidebar?.logoSrc ??
                config.userConfig?.themeConfig?.sidebar?.logoSrc
            )?.light
          ) || defaultFavicon,
        generator: 'VitePress Neptu Blog Theme',
        updated: new Date(),
        feedLinks,
      })

      try {
        // Recursive: posts may live in a folder of their own
        // (`posts/my-article/index.md`) or in deeper subfolders.
        const posts = await createContentLoader(
          `${localeIndex}/${POSTS_DIR}/**/*.md`,
          { includeSrc: true }
        ).load()

        const showDrafts = resolveShowDrafts(
          locale.themeConfig?.drafts ?? config.userConfig?.themeConfig?.drafts
        )
        const sortedPosts = posts
          .filter((post) =>
            isPostVisible(post.frontmatter as PostFrontmatter, { showDrafts })
          )
          .sort(
            (a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
          )
        const configuredMaxPosts = Number(
          locale.themeConfig?.feeds?.maxPosts ??
          config.userConfig?.themeConfig?.feeds?.maxPosts
        )
        const maxPosts =
          Number.isFinite(configuredMaxPosts) && configuredMaxPosts >= 0
            ? configuredMaxPosts
            : 50
        const fullContent = Boolean(
          locale.themeConfig?.feeds?.fullContent ??
          config.userConfig?.themeConfig?.feeds?.fullContent
        )
        let addedPostsCount = 0

        for (const { url, frontmatter, src } of sortedPosts) {
          if (addedPostsCount >= maxPosts) break

          const fm = frontmatter as PostFrontmatter
          try {
            if (!validatePostForRss(fm, url)) {
              console.warn(`Skipping post ${url} - validation failed`)
              continue
            }

            const explicitDescription =
              typeof fm.description === 'string' ? fm.description.trim() : ''
            const configuredMaxDescriptionLength = Number(
              locale.themeConfig?.seo?.maxDescriptionLength ??
              config.userConfig?.themeConfig?.seo?.maxDescriptionLength
            )
            const maxDescriptionLength =
              Number.isFinite(configuredMaxDescriptionLength) &&
              configuredMaxDescriptionLength >= 0
                ? configuredMaxDescriptionLength
                : 300
            const description = explicitDescription
              ? explicitDescription
              : extractDescriptionFromMd(
                  src!,
                  maxDescriptionLength
                )
            const guid = createPostGuid(siteUrl, url, fm.date)
            const categories = formatTagsForRss(fm.tags, siteUrl, localeIndex)
            const content = fullContent
              ? mdToFeedHtml(
                  parseMdFile(src!, url).content,
                  `${siteUrl}${url}`
                )
              : undefined

            feeds[localeIndex]!.addItem({
              title: fm.title || '',
              description,
              content,
              id: guid,
              link: `${siteUrl}${url}`,
              date: fm.date ? new Date(fm.date) : new Date(),
              image: makeAbsoluteUrl(
                siteUrl,
                resolveContentMediaPath(fm.cover, mdPathFromUrl(url), {
                  allowBare: true,
                }) as string | undefined
              ),
              author: makeAuthorForRss(
                config,
                fm,
                localeSiteUrl,
                localeIndex
              ) as unknown as Author[],
              category: categories.length > 0 ? categories : undefined,
              published: fm.date ? new Date(fm.date) : new Date(),
            })
            addedPostsCount += 1
          } catch (postError) {
            console.error(`Error processing post ${url}:`, postError)
            continue
          }
        }
      } catch (loaderError) {
        delete feeds[localeIndex]
        const error = new Error(
          `Error loading posts for locale ${localeIndex}: ${(loaderError as Error).message}`,
          { cause: loaderError as Error }
        )
        generationErrors.push(error)
        console.error(error.message, loaderError)
        continue
      }
    }

    for (const localeIndex of Object.keys(feeds)) {
      try {
        const feedDir = path.join(config.outDir!, localeIndex)
        fs.mkdirSync(feedDir, { recursive: true })

        for (const format of rssFormats) {
          try {
            const formatInfo = getRssFormatInfo(format)
            const feedPath = path.join(feedDir, path.basename(getFeedPath(localeIndex, format)))

            const feedContent = formatInfo.generator(feeds[localeIndex]!)

            fs.writeFileSync(feedPath, feedContent, DEFAULT_ENCODING)
          } catch (formatError) {
            const error = new Error(
              `Error generating ${format} feed for locale ${localeIndex}: ${(formatError as Error).message}`,
              { cause: formatError as Error }
            )
            generationErrors.push(error)
            console.error(error.message, formatError)
          }
        }
      } catch (writeError) {
        const error = new Error(
          `Error writing feeds for locale ${localeIndex}: ${(writeError as Error).message}`,
          { cause: writeError as Error }
        )
        generationErrors.push(error)
        console.error(error.message, writeError)
      }
    }

    if (generationErrors.length > 0) {
      throw new AggregateError(generationErrors, 'RSS feed generation completed with errors')
    }
  } catch (error) {
    console.error('Error generating RSS feeds:', error)
    throw error
  }
}
