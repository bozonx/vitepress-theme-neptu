import { describe, it, expect, afterEach } from 'vitest'
import {
  areDraftsVisibleByDefault,
  isDraft,
  isPostVisible,
  resolveIncludeDrafts,
} from '../../../../src/utils/shared/publication.ts'

const originalNodeEnv = process.env.NODE_ENV

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv
})

describe('isDraft', () => {
  it('is true only for an explicit `draft: true`', () => {
    expect(isDraft({ draft: true })).toBe(true)
    expect(isDraft({ draft: false })).toBe(false)
    expect(isDraft({})).toBe(false)
    expect(isDraft(undefined)).toBe(false)
  })

  it('does not treat a truthy non-boolean as a draft', () => {
    expect(isDraft({ draft: 'yes' })).toBe(false)
    expect(isDraft({ draft: 1 })).toBe(false)
  })
})

describe('isPostVisible', () => {
  it('hides drafts by default', () => {
    expect(isPostVisible({ draft: true })).toBe(false)
    expect(isPostVisible({ title: 'Published' })).toBe(true)
  })

  it('keeps drafts when asked to', () => {
    expect(isPostVisible({ draft: true }, { includeDrafts: true })).toBe(true)
  })
})

describe('areDraftsVisibleByDefault', () => {
  it('is off in a production build and on elsewhere', () => {
    process.env.NODE_ENV = 'production'
    expect(areDraftsVisibleByDefault()).toBe(false)

    process.env.NODE_ENV = 'development'
    expect(areDraftsVisibleByDefault()).toBe(true)
  })
})

describe('resolveIncludeDrafts', () => {
  it('prefers the explicit config over the environment', () => {
    process.env.NODE_ENV = 'production'
    expect(resolveIncludeDrafts({ includeDrafts: true })).toBe(true)

    process.env.NODE_ENV = 'development'
    expect(resolveIncludeDrafts({ includeDrafts: false })).toBe(false)
  })

  it('falls back to the environment when unset', () => {
    process.env.NODE_ENV = 'production'
    expect(resolveIncludeDrafts(undefined)).toBe(false)
    expect(resolveIncludeDrafts({})).toBe(false)
  })
})
