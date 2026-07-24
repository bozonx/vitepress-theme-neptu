import { describe, it, expect, vi } from 'vitest'
import {
  handleFastRedirectToRecentPosts,
  resolveNavigatorLang,
} from '../../../../src/utils/client/browser.ts'

describe('handleFastRedirectToRecentPosts', () => {
  it('replaces state when ?recent=1', () => {
    const history = { replaceState: vi.fn() } as unknown as History
    const location = { search: '?recent=1', pathname: '/en/post' } as unknown as Location
    const win = { history, location } as unknown as Window

    handleFastRedirectToRecentPosts(win)
    expect(history.replaceState).toHaveBeenCalledWith({}, '', '/en/post')
  })

  it('does nothing when no recent param', () => {
    const history = { replaceState: vi.fn() } as unknown as History
    const location = { search: '?page=2', pathname: '/en/post' } as unknown as Location
    const win = { history, location } as unknown as Window

    handleFastRedirectToRecentPosts(win)
    expect(history.replaceState).not.toHaveBeenCalled()
  })

  it('does nothing when recent param is not 1', () => {
    const history = { replaceState: vi.fn() } as unknown as History
    const location = { search: '?recent=0', pathname: '/en/post' } as unknown as Location
    const win = { history, location } as unknown as Window

    handleFastRedirectToRecentPosts(win)
    expect(history.replaceState).not.toHaveBeenCalled()
  })
})

describe('resolveNavigatorLang', () => {
  it('returns exact match', () => {
    const navigator = { language: 'en-US' } as Navigator
    expect(resolveNavigatorLang(navigator, ['en-US', 'ru'])).toBe('en-US')
  })

  it('returns short match when exact not found', () => {
    const navigator = { language: 'en-US' } as Navigator
    expect(resolveNavigatorLang(navigator, ['en', 'ru'])).toBe('en')
  })

  it('returns undefined when no match', () => {
    const navigator = { language: 'de-DE' } as Navigator
    expect(resolveNavigatorLang(navigator, ['en', 'ru'])).toBeUndefined()
  })

  it('returns undefined when navigator language is missing', () => {
    const navigator = {} as Navigator
    expect(resolveNavigatorLang(navigator, ['en'])).toBeUndefined()
  })

  it('uses userLanguage fallback', () => {
    const navigator = { userLanguage: 'ru-RU' } as unknown as Navigator
    expect(resolveNavigatorLang(navigator, ['ru'])).toBe('ru')
  })

  it('returns undefined for empty locales', () => {
    const navigator = { language: 'en' } as Navigator
    expect(resolveNavigatorLang(navigator, [])).toBeUndefined()
  })

  it('prefers exact match over short match', () => {
    const navigator = { language: 'en-GB' } as Navigator
    expect(resolveNavigatorLang(navigator, ['en', 'en-GB'])).toBe('en-GB')
  })
})
