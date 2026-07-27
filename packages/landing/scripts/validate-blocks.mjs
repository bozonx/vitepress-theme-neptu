#!/usr/bin/env node
/** Validates `blocks:` frontmatter in Markdown files against the public schema. */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import { parse } from 'yaml'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const schema = JSON.parse(
  readFileSync(resolve(packageRoot, 'schema/landing-blocks.schema.json'), 'utf8')
)
const validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true }).compile(schema)
const builtInTypes = new Set(
  schema.definitions.block.allOf[1].oneOf
    .map((branch) => branch.properties?.type?.const)
    .filter(Boolean)
)
const args = process.argv.slice(2)
if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: neptu-landing [path ...] [--allow-type=name]

Validate landing blocks in Markdown files. Paths default to the current directory.
Pass files or directories; directories are searched recursively.`)
  process.exit(0)
}
const allowedCustomTypes = new Set(args.flatMap((arg) => arg.startsWith('--allow-type=') ? [arg.slice(13)] : []))
const inputPaths = args.filter((arg) => !arg.startsWith('--')).map((path) => resolve(path))
const roots = inputPaths.length ? inputPaths : [process.cwd()]
const ignored = new Set(['.git', 'node_modules', 'dist', '.vitepress', 'coverage', 'playwright-report'])
const markdownFiles = []

const walk = (path) => {
  const entries = readdirSync(path, { withFileTypes: true })
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue
    const child = join(path, entry.name)
    if (entry.isDirectory()) walk(child)
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') markdownFiles.push(child)
  }
}
for (const path of roots) {
  if (extname(path).toLowerCase() === '.md') markdownFiles.push(path)
  else walk(path)
}

const displayRoot = roots.length === 1 && extname(roots[0]).toLowerCase() !== '.md'
  ? roots[0]
  : process.cwd()

let invalid = 0
for (const file of markdownFiles) {
  const content = readFileSync(file, 'utf8')
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) continue
  let frontmatter
  try {
    frontmatter = parse(match[1])
  } catch (error) {
    // Broken YAML is a finding, not a reason to abort the whole run.
    invalid += 1
    console.error(`\n${relative(displayRoot, file)}`)
    console.error(`  ${error.message.split('\n')[0]}`)
    continue
  }
  if (!frontmatter?.blocks && frontmatter?.layout !== 'landing') continue
  const schemaValid = validate(frontmatter)
  const semanticErrors = []
  const blocks = Array.isArray(frontmatter.blocks) ? frontmatter.blocks : []

  for (const [index, block] of blocks.entries()) {
    const type = block?.type
    if (typeof type === 'string' && !builtInTypes.has(type) && !allowedCustomTypes.has(type)) {
      semanticErrors.push(`/blocks/${index}/type unknown block type "${type}" (use --allow-type=${type} for a registered custom block)`)
    }
  }

  const heroes = blocks.map((block, index) => ({ block, index })).filter(({ block }) => block?.type === 'hero')
  if (frontmatter.layout === 'landing') {
    if (heroes.length !== 1) semanticErrors.push(`/blocks must contain exactly one hero (found ${heroes.length})`)
    else if (blocks.slice(0, heroes[0].index).some((block) => block?.type !== 'banner')) {
      semanticErrors.push(`/blocks/${heroes[0].index} hero must be first; only banner may precede it`)
    }
  }

const ids = new Map()
  for (const [index, block] of blocks.entries()) {
    if (block?.id) {
      if (ids.has(block.id)) semanticErrors.push(`/blocks/${index}/id duplicate id "${block.id}" (first used at ${ids.get(block.id)})`)
      else ids.set(block.id, index)
    }

    if (block?.type === 'compare' && Array.isArray(block.columns)) {
      for (const [rowIndex, row] of (block.rows ?? []).entries()) {
        if (Array.isArray(row.values) && row.values.length !== block.columns.length) {
          semanticErrors.push(`/blocks/${index}/rows/${rowIndex}/values must match columns length ${block.columns.length}`)
        }
      }
    }

    if (block?.type === 'team' && Array.isArray(block.groups) && Array.isArray(block.items)) {
      const groupIds = new Set(block.groups.map((group) => group?.id))
      for (const [memberIndex, member] of block.items.entries()) {
        if (member?.group && !groupIds.has(member.group)) {
          semanticErrors.push(`/blocks/${index}/items/${memberIndex}/group references unknown group "${member.group}"`)
        }
      }
    }
  }

  if (schemaValid && semanticErrors.length === 0) continue

  invalid += 1
  console.error(`\n${relative(displayRoot, file)}`)
  for (const error of validate.errors ?? []) {
    console.error(`  ${error.instancePath || '/'} ${error.message ?? 'is invalid'}`)
  }
  for (const error of semanticErrors) console.error(`  ${error}`)
}

if (invalid) {
  console.error(`\nLanding block validation failed in ${invalid} file(s).`)
  process.exit(1)
}

console.log(`Validated landing blocks in ${markdownFiles.length} Markdown file(s).`)
