import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { STYLE_PRESETS } from '../../../src/composables/useStylePreset.ts'

// `import.meta.url` is not a file URL under the happy-dom environment; vitest
// runs with the package root as cwd.
const css = readFileSync(
  resolve(process.cwd(), 'src/styles/style-presets.css'),
  'utf-8'
)

/** `[data-style='x'] { … }` → `{ x: 'the declarations' }`. */
function parseBlocks(source: string): Record<string, string> {
  const blocks: Record<string, string> = {}
  const re = /\[data-style='([^']+)'\]\s*\{([^}]*)\}/g
  let match: RegExpExecArray | null
  while ((match = re.exec(source))) blocks[match[1]!] = match[2]!
  return blocks
}

const blocks = parseBlocks(css)
const rootBlock = /:root,\s*\[data-style='soft'\]\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''

const declaredTokens = (block: string): string[] =>
  [...block.matchAll(/^\s*(--neptu-[\w-]+):/gm)].map((m) => m[1]!)

describe('style-presets.css', () => {
  it('defines a block for every preset the picker offers', () => {
    for (const preset of STYLE_PRESETS) {
      expect(Object.keys(blocks)).toContain(preset.id)
    }
  })

  it('offers a preset for every block it defines', () => {
    const ids = STYLE_PRESETS.map((preset) => preset.id)
    for (const id of Object.keys(blocks)) {
      expect(ids).toContain(id)
    }
  })

  it('applies the default preset to :root as well, so the attribute is optional', () => {
    expect(rootBlock).not.toBe('')
    expect(declaredTokens(rootBlock).length).toBeGreaterThan(0)
  })

  /**
   * All presets target the same `<html>`, so a token one preset omits keeps the
   * value left behind by the previously applied preset. Every block therefore
   * has to assign the complete set.
   */
  it('assigns the identical token set in every preset', () => {
    const expected = [...declaredTokens(rootBlock)].sort()
    expect(expected.length).toBeGreaterThan(20)

    for (const [id, block] of Object.entries(blocks)) {
      if (id === 'soft') continue
      expect([...declaredTokens(block)].sort(), `preset "${id}"`).toEqual(expected)
    }
  })

  it('names no color of its own — presets read the bridge tokens only', () => {
    const colorLiteral = /(#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\bvar\(--gray-|\bvar\(--ln-|\bvar\(--primary-)/i
    for (const [id, block] of Object.entries({ soft: rootBlock, ...blocks })) {
      expect(colorLiteral.test(block), `preset "${id}" hardcodes a color`).toBe(
        false
      )
    }
  })
})
