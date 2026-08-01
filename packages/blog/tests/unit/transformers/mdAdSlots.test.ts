import { describe, it, expect } from 'vitest'
import { mdAdSlots } from '../../../src/transformers/mdAdSlots.ts'
import type { AdsConfig } from '../../../src/types.d.ts'

class MockToken {
  content = ''
  level = 0
  block = false

  constructor(
    public type: string,
    public tag: string,
    public nesting: number
  ) {}
}

/**
 * Build a token stream shaped like markdown-it's output for a document made of
 * alternating `## heading` and paragraph blocks.
 */
function createTokens(sections: number): MockToken[] {
  const tokens: MockToken[] = []

  for (let i = 0; i < sections; i++) {
    const headingOpen = new MockToken('heading_open', 'h2', 1)
    const headingText = new MockToken('inline', '', 0)
    headingText.content = `Heading ${i + 1}`
    const headingClose = new MockToken('heading_close', 'h2', -1)

    const paraOpen = new MockToken('paragraph_open', 'p', 1)
    const paraText = new MockToken('inline', '', 0)
    paraText.content = `Body ${i + 1}`
    const paraClose = new MockToken('paragraph_close', 'p', -1)

    tokens.push(headingOpen, headingText, headingClose, paraOpen, paraText, paraClose)
  }

  return tokens
}

function run(
  tokens: MockToken[],
  ads?: AdsConfig,
  frontmatter: Record<string, unknown> = {}
): MockToken[] {
  let rule: ((state: unknown) => void) | undefined

  const md = {
    core: {
      ruler: {
        push: (_name: string, fn: (state: unknown) => void) => {
          rule = fn
        },
      },
    },
  }

  mdAdSlots(md, { ads })
  rule?.({ tokens, Token: MockToken, env: { frontmatter } })

  return tokens
}

/** Indices of the injected slots within the stream. */
function adSlots(tokens: MockToken[]): MockToken[] {
  return tokens.filter((t) => t.content.includes('<NeptuAd'))
}

describe('mdAdSlots', () => {
  it('places a slot before the start-th heading', () => {
    const tokens = run(createTokens(4))
    const slots = adSlots(tokens)

    // `start: 2` — the first section is left clean, so the slot lands on the
    // second `heading_open`. With four headings and `every: 3` there is no
    // room for a second one.
    expect(slots).toHaveLength(1)
    expect(tokens.indexOf(slots[0])).toBe(6)
    expect(tokens[7].type).toBe('heading_open')
  })

  it('emits the placement and a stable index', () => {
    const slots = adSlots(run(createTokens(8)))

    expect(slots[0].content).toContain('placement="in-content"')
    expect(slots[0].content).toContain(':index="0"')
    expect(slots[1].content).toContain(':index="1"')
  })

  it('spaces slots by `every` headings', () => {
    const tokens = run(createTokens(8), { inContent: { every: 3, max: 2 } })
    const slots = adSlots(tokens)

    // Headings 2 and 5 — each `heading_open` sits 6 tokens apart, and the
    // first insertion shifts everything after it by one.
    expect(tokens.indexOf(slots[0])).toBe(6)
    expect(tokens.indexOf(slots[1])).toBe(25)
  })

  it('never exceeds `max`', () => {
    expect(adSlots(run(createTokens(20), { inContent: { max: 1 } }))).toHaveLength(1)
  })

  it('leaves short articles alone', () => {
    // Two sections is four top-level blocks, below the default minBlocks of 6.
    expect(adSlots(run(createTokens(2)))).toHaveLength(0)
  })

  it('can anchor on paragraphs instead of headings', () => {
    const tokens = run(createTokens(6), {
      inContent: { anchor: 'paragraph', start: 1, every: 2, max: 2 },
    })
    const slots = adSlots(tokens)

    expect(slots).toHaveLength(2)
    expect(tokens[tokens.indexOf(slots[0]) + 1].type).toBe('paragraph_open')
  })

  it('ignores headings nested inside containers', () => {
    const tokens = createTokens(8)
    for (const token of tokens) token.level = 1

    expect(adSlots(run(tokens))).toHaveLength(0)
  })

  it('skips pages whose layout is not in the list', () => {
    expect(adSlots(run(createTokens(8), undefined, { layout: 'page' }))).toHaveLength(0)
  })

  it('honours frontmatter over the layout list', () => {
    expect(
      adSlots(run(createTokens(8), undefined, { layout: 'page', ads: true }))
    ).toHaveLength(2)
    expect(
      adSlots(run(createTokens(8), undefined, { layout: 'post', ads: false }))
    ).toHaveLength(0)
  })

  it('applies the landing fallback layout', () => {
    const landing: AdsConfig = { layouts: ['doc'], defaultLayout: 'doc' }
    expect(adSlots(run(createTokens(8), landing, {}))).toHaveLength(2)
  })

  it('does nothing when ads or in-content slots are off', () => {
    expect(adSlots(run(createTokens(8), { enabled: false }))).toHaveLength(0)
    expect(
      adSlots(run(createTokens(8), { inContent: { enabled: false } }))
    ).toHaveLength(0)
    expect(adSlots(run(createTokens(8), { inContent: { max: 0 } }))).toHaveLength(0)
  })
})
