import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import { describe, expect, it } from 'vitest'
import { blockTypes } from '../../../src/blocks/registry.ts'

const schema = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../../schema/landing-blocks.schema.json'), 'utf8')
)
const validate = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true }).compile(schema)

describe('landing blocks schema', () => {
  it('has a branch for every built-in block type', () => {
    const branches = schema.definitions.block.allOf[1].oneOf
    const builtInTypes = branches
      .map((branch: { properties?: { type?: { const?: string } } }) => branch.properties?.type?.const)
      .filter(Boolean)

    expect(builtInTypes.sort()).toEqual([...blockTypes].sort())
  })

  it('rejects an unknown property on a built-in block', () => {
    expect(validate({ blocks: [{ type: 'hero', titel: 'typo' }] })).toBe(false)
  })

  it('allows properties of custom registered block types', () => {
    expect(validate({ blocks: [{ type: 'my-block', arbitrary: true }] })).toBe(true)
  })

  it('uses the carousel slide contract, not the feature contract', () => {
    expect(validate({ blocks: [{ type: 'carousel', items: [{ title: 'Slide', span: 2 }] }] })).toBe(false)
  })

  it('validates new blocks and shared card fields', () => {
    expect(validate({ blocks: [
      { type: 'content', content: '<p>Story</p>', variant: 'card' },
      { type: 'collection', items: [{ title: 'Guide', date: '2026-07-27', tags: ['Docs'], actions: [{ text: 'Read', link: '/guide' }] }] },
      { type: 'embed', src: '/map', loading: 'lazy' },
    ] })).toBe(true)
  })

  it('rejects incomplete data-mode blocks and inert actions', () => {
    expect(validate({ blocks: [{ type: 'hero' }] })).toBe(false)
    expect(validate({ blocks: [{ type: 'video', title: 'Demo' }] })).toBe(false)
    expect(validate({ blocks: [{ type: 'features', items: [] }] })).toBe(false)
    expect(validate({ blocks: [{ type: 'cta', title: 'Go', actions: [{ text: 'Start' }] }] })).toBe(false)
  })
})
