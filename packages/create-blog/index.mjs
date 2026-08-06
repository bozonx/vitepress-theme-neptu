#!/usr/bin/env node
//
// Scaffolds a new blog from the `vitepress-theme-neptu` starter template.
//
//   npm create neptu-blog@latest my-blog
//   npx create-neptu-blog my-blog
//
// The template lives inside the theme package, so it is always in sync with
// the theme version this scaffolder depends on — there is no second copy to
// keep updated.
//
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import readline from 'node:readline/promises'
import { createRequire } from 'node:module'
import { stdin, stdout } from 'node:process'

const require = createRequire(import.meta.url)

/** Directories that must never be copied out of a working template checkout. */
const SKIP_ENTRIES = new Set(['node_modules', 'dist', 'cache', '.git'])

/** IETF tags for the locales the theme ships translations for. */
const LOCALE_LANGS = {
  ar: 'ar',
  cs: 'cs-CZ',
  de: 'de-DE',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  he: 'he-IL',
  hi: 'hi-IN',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
  lv: 'lv-LV',
  nl: 'nl-NL',
  pl: 'pl-PL',
  pt: 'pt-PT',
  ru: 'ru-RU',
  sr: 'sr-RS',
  sv: 'sv-SE',
  th: 'th-TH',
  tr: 'tr-TR',
  zh: 'zh-CN',
}

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
}

function fail(message) {
  console.error(`\n${c.red('✖')} ${message}\n`)
  process.exit(1)
}

/** Resolves `template/` inside the installed theme package. */
function findTemplateDir() {
  const pkgJson = require.resolve('vitepress-theme-neptu/package.json')
  const dir = path.join(path.dirname(pkgJson), 'template')
  return dir
}

async function isEmptyDir(dir) {
  try {
    const entries = await fs.readdir(dir)
    return entries.filter((e) => e !== '.git').length === 0
  } catch (error) {
    if (error.code === 'ENOENT') return true
    throw error
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    if (SKIP_ENTRIES.has(entry.name)) continue
    const from = path.join(src, entry.name)
    // npm strips a packaged `.gitignore`; the template ships it as-is when the
    // scaffolder runs from a git checkout, so accept either spelling.
    const name = entry.name === 'gitignore' ? '.gitignore' : entry.name
    const to = path.join(dest, name)
    if (entry.isDirectory()) await copyDir(from, to)
    else await fs.copyFile(from, to)
  }
}

async function edit(file, fn) {
  const before = await fs.readFile(file, 'utf8')
  const after = fn(before)
  if (after !== before) await fs.writeFile(file, after)
}

/** Package names must be lowercase and free of most punctuation. */
function toPackageName(name) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-~._]+/g, '-')
      .replace(/^[-_.]+|[-_.]+$/g, '') || 'my-neptu-blog'
  )
}

async function main() {
  const argv = process.argv.slice(2)
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(`
${c.bold('create-neptu-blog')} — scaffold a VitePress blog with the Neptu theme

  ${c.cyan('npm create neptu-blog@latest')} [directory]
  ${c.cyan('npx create-neptu-blog')} [directory]

Options:
  --title <text>    Blog title
  --locale <code>   Content locale folder, e.g. en, ru, pt-BR  (default: en)
  -y, --yes         Accept defaults, ask nothing
  -h, --help        Show this message
`)
    return
  }

  const flag = (name) => {
    const i = argv.indexOf(`--${name}`)
    return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('-')
      ? argv[i + 1]
      : undefined
  }
  const yes = argv.includes('-y') || argv.includes('--yes')
  const positional = argv.find((a) => !a.startsWith('-'))

  const rl =
    yes || !stdin.isTTY
      ? null
      : readline.createInterface({ input: stdin, output: stdout })
  const ask = async (question, fallback) => {
    if (!rl) return fallback
    const answer = (
      await rl.question(`${question} ${c.dim(`(${fallback})`)} `)
    ).trim()
    return answer || fallback
  }

  console.log(
    `\n${c.bold('Neptu blog')} — a VitePress blog, ready to write in.\n`
  )

  const dirName = positional || (await ask('Directory name:', 'my-blog'))
  const target = path.resolve(process.cwd(), dirName)

  if (!(await isEmptyDir(target))) {
    rl?.close()
    fail(`Directory ${c.bold(dirName)} already exists and is not empty.`)
  }

  const title = flag('title') || (await ask('Blog title:', 'My Neptu Blog'))
  const locale = (flag('locale') || (await ask('Content locale:', 'en'))).trim()

  rl?.close()

  if (!/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(locale)) {
    fail(`"${locale}" is not a valid locale code. Use e.g. en, ru or pt-BR.`)
  }

  const templateDir = findTemplateDir()
  try {
    await fs.access(templateDir)
  } catch {
    fail(`Starter template not found at ${templateDir}.`)
  }

  await copyDir(templateDir, target)

  // The starter ships an `en` locale folder; rename it when another was asked
  // for. The `virtual:neptu-posts-data` module auto-discovers locale data
  // loaders, so no manual edits to `Layout.vue` are needed.
  if (locale !== 'en') {
    await fs.rename(
      path.join(target, 'src', 'en'),
      path.join(target, 'src', locale)
    )
  }

  const lang =
    LOCALE_LANGS[locale] || LOCALE_LANGS[locale.split('-')[0]] || locale

  await edit(path.join(target, 'package.json'), (s) =>
    s.replace('"name": "my-neptu-blog"', `"name": "${toPackageName(dirName)}"`)
  )

  await edit(path.join(target, 'src', locale, '_site.yaml'), (s) =>
    s
      .replace(/^lang:\s*['"]?[^'"]*['"]?$/m, `lang: '${lang}'`)
      .replace(/^title:\s*['"]?[^'"]*['"]?$/m, `title: '${title.replace(/'/g, "''")}'`)
  )

  // Schema hints are written relative to a `node_modules` sibling; they resolve
  // once dependencies are installed, so nothing to rewrite here.

  const rel = path.relative(process.cwd(), target) || '.'
  console.log(`
${c.green('✔')} Created ${c.bold(rel)}

  ${c.dim('Next:')}
    cd ${rel}
    npm install
    npm run dev

  ${c.dim('Then:')}
    • set ${c.cyan('siteUrl')} and ${c.cyan('repo')} in src/.vitepress/config.ts
    • edit src/site.yaml and src/${locale}/_site.yaml
    • replace the demo posts in src/${locale}/posts/

  ${c.dim('Guide:')} https://bozonx.github.io/vitepress-theme-neptu/blog
`)
}

main().catch((error) => fail(error?.stack || String(error)))
