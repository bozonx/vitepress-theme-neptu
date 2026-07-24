import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadPostsData } from 'vitepress-theme-neptu-blog/list-helpers/node'

import { popularPosts, postList } from '../.vitepress/config.js'

const localeDir = path.dirname(fileURLToPath(import.meta.url))

export default function () {
  return loadPostsData(localeDir, {
    popularPostsEnabled: popularPosts.enabled,
    dataSource: popularPosts.dataSource,
    maxPreviewLength: postList?.maxPreviewLength,
  })
}
