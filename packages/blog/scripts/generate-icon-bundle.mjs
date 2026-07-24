/**
 * Extracts only the icons used by the theme from @iconify-json/* packages
 * and writes them to src/generated/icons-bundle.ts as a collection suitable
 * for addCollection() from @iconify/vue.
 *
 * Run: node scripts/generate-icon-bundle.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname, join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getIcons } from '@iconify/utils'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

/**
 * Explicit base list of icon-set → array of icon names used in the theme.
 * Icons are referenced via "prefix:name" strings throughout the codebase.
 */
const baseIconSets = {
  mdi: [
    'users',
    'web',
    'youtube',
    'twitter',
    'facebook',
    'instagram',
    'vk',
    'mastodon',
    'globe',
    'rss',
    'spotify',
    'page-first',
    'page-last',
    'file',
    'file-pdf-box',
    'file-word-box',
    'file-excel-box',
    'file-powerpoint-box',
    'file-document-outline',
    'zip-box',
    'file-image',
    'file-video',
    'file-music',
    'code-json',
    'language-javascript',
    'language-typescript',
    'language-html5',
    'language-css3',
    'file-xml-box',
    'loading',
    'play',
    'pause',
    'stop',
    'download',
    'refresh',
    'alert-circle',
    'close',
    'chevron-left',
    'chevron-right',
    'chevron-up',
    'volume-high',
    'music-note',
    'github',
    'information-outline',
    'shield-outline',
    'clock',
    'fire',
    'home',
    'heart',
    'coffee',
    'tag',
  ],
  'fa6-solid': [
    'hand-holding-heart',
    'bolt',
    'star',
    'calendar-days',
    'tag',
    'xmark',
    'arrow-up',
    'bars',
    'magnifying-glass',
    'comment-dots',
    'share-nodes',
    'palette',
  ],
  'fa6-brands': ['youtube', 'x-twitter', 'telegram', 'github-alt', 'github'],
  solar: ['document-linear'],
  bi: ['rss-fill'],
  'simple-icons': [
    'castbox',
    'amazonmusic',
    'iheartradio',
    'tunein',
    'pocketcasts',
    'applepodcasts',
    'overcast',
    'tiktok',
    'diaspora',
    'threads',
    'bluesky',
    'odnoklassniki',
  ],
  ri: ['vk-fill', 'twitter-x-fill'],
  'vscode-icons': ['file-type-atom'],
  cbi: ['deezer-logo'],
  logos: ['telegram', 'whatsapp-icon', 'facebook', 'linkedin-icon', 'reddit-icon', 'mastodon-icon'],
  cib: ['vk'],
  'material-symbols': ['translate', 'headphones-outline'],
}

/**
 * Scans directories for icon usages of pattern "prefix:name"
 * @param {string[]} dirs
 * @returns {Record<string, Set<string>>}
 */
function scanCodebaseForIcons(dirs) {
  const result = {}
  const validExtensions = ['.vue', '.ts', '.js', '.mjs', '.yaml', '.yml', '.md', '.json']

  for (const dirName of dirs) {
    const dirPath = resolve(root, dirName)
    if (!existsSync(dirPath)) continue

    function walk(currentDir) {
      const entries = readdirSync(currentDir, { withFileTypes: true })
      for (const entry of entries) {
        if (
          entry.name === 'node_modules' ||
          entry.name === '.git' ||
          entry.name === '.vitepress' ||
          entry.name === 'dist' ||
          entry.name === 'generated'
        ) {
          continue
        }
        const fullPath = join(currentDir, entry.name)
        if (entry.isDirectory()) {
          walk(fullPath)
        } else if (entry.isFile() && validExtensions.includes(extname(entry.name))) {
          const content = readFileSync(fullPath, 'utf-8')
          const matches = content.matchAll(/['"]([a-z0-9-]+):([a-z0-9-]+)['"]/g)
          for (const match of matches) {
            const prefix = match[1]
            const name = match[2]
            const pkgPath = resolve(root, `node_modules/@iconify-json/${prefix}/icons.json`)
            if (existsSync(pkgPath)) {
              if (!result[prefix]) result[prefix] = new Set()
              result[prefix].add(name)
            }
          }
        }
      }
    }

    walk(dirPath)
  }

  return result
}

// Build merged icon set map
const scanned = scanCodebaseForIcons(['src', 'docs', 'doc'])
const iconSets = {}

for (const [prefix, names] of Object.entries(baseIconSets)) {
  iconSets[prefix] = new Set(names)
}

for (const [prefix, nameSet] of Object.entries(scanned)) {
  if (!iconSets[prefix]) iconSets[prefix] = new Set()
  for (const name of nameSet) {
    iconSets[prefix].add(name)
  }
}

/**
 * @param {string} setName
 * @returns {Record<string, unknown>}
 */
function loadIconSet(setName) {
  const path = resolve(root, `node_modules/@iconify-json/${setName}/icons.json`)
  return JSON.parse(readFileSync(path, 'utf-8'))
}

/**
 * Extract a subset of icons from a full icon-set JSON using @iconify/utils.
 * @param {Record<string, unknown>} fullSet
 * @param {string[]} names
 * @returns {Record<string, unknown>}
 */
function extractIcons(fullSet, names) {
  const subset = getIcons(fullSet, names)
  if (!subset) {
    console.warn(`  WARNING: failed to extract icons from set ${fullSet.prefix}`)
    return { prefix: fullSet.prefix, icons: {} }
  }
  return subset
}

const collections = []

for (const [setName, nameSet] of Object.entries(iconSets)) {
  const iconNames = Array.from(nameSet)
  console.log(`Processing ${setName}...`)
  const fullSet = loadIconSet(setName)
  const subset = extractIcons(fullSet, iconNames)
  const count = Object.keys(subset.icons).length + Object.keys(subset.aliases || {}).length
  console.log(`  ${count} icons extracted`)
  collections.push(subset)
}

const outputDir = resolve(root, 'src/generated')
mkdirSync(outputDir, { recursive: true })

const outputPath = resolve(outputDir, 'icons-bundle.ts')

// Build the TS file
const jsonStr = JSON.stringify(collections, null, 2)
const tsContent = `// AUTO-GENERATED by scripts/generate-icon-bundle.mjs — do not edit manually.
// Contains only the icons used by vitepress-theme-neptu-blog, extracted from
// @iconify-json/* packages at build time. This avoids runtime API fetches.
import type { IconifyJSON } from '@iconify/vue'

const collections: IconifyJSON[] = ${jsonStr}

export default collections
`

writeFileSync(outputPath, tsContent, 'utf-8')
console.log(`\nWritten ${collections.length} collections to ${outputPath}`)
console.log('Done!')
