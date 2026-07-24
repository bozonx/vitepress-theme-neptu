import { describe, it, expect } from 'vitest'
import { resolveEditLinkPattern } from '../../../../src/utils/node/editLink.ts'

describe('resolveEditLinkPattern', () => {
  it('returns empty string for empty or missing repoUrl', () => {
    expect(resolveEditLinkPattern('')).toBe('')
    expect(resolveEditLinkPattern('   ')).toBe('')
  })

  it('builds GitHub pattern by default', () => {
    expect(resolveEditLinkPattern('https://github.com/user/repo')).toBe(
      'https://github.com/user/repo/edit/main/src/:path'
    )
  })

  it('builds GitLab pattern when hostname contains gitlab', () => {
    expect(resolveEditLinkPattern('https://gitlab.com/user/repo')).toBe(
      'https://gitlab.com/user/repo/-/edit/main/src/:path'
    )
    expect(resolveEditLinkPattern('https://my.gitlab.company.com/org/project')).toBe(
      'https://my.gitlab.company.com/org/project/-/edit/main/src/:path'
    )
  })

  it('builds Bitbucket pattern when hostname contains bitbucket', () => {
    expect(resolveEditLinkPattern('https://bitbucket.org/user/repo')).toBe(
      'https://bitbucket.org/user/repo/edit/main/src/:path'
    )
  })

  it('builds Gitea pattern when hostname contains gitea', () => {
    expect(resolveEditLinkPattern('https://gitea.example.com/user/repo')).toBe(
      'https://gitea.example.com/user/repo/_edit/main/src/:path'
    )
  })

  it('builds Codeberg pattern when hostname contains codeberg', () => {
    expect(resolveEditLinkPattern('https://codeberg.org/user/repo')).toBe(
      'https://codeberg.org/user/repo/_edit/main/src/:path'
    )
  })

  it('strips trailing .git suffix', () => {
    expect(resolveEditLinkPattern('https://github.com/user/repo.git')).toBe(
      'https://github.com/user/repo/edit/main/src/:path'
    )
  })

  it('strips trailing slashes', () => {
    expect(resolveEditLinkPattern('https://github.com/user/repo/')).toBe(
      'https://github.com/user/repo/edit/main/src/:path'
    )
  })

  it('uses custom branch when provided', () => {
    expect(resolveEditLinkPattern('https://github.com/user/repo', 'develop')).toBe(
      'https://github.com/user/repo/edit/develop/src/:path'
    )
  })

  it('uses custom srcDir when provided', () => {
    expect(resolveEditLinkPattern('https://github.com/user/repo', 'main', 'docs')).toBe(
      'https://github.com/user/repo/edit/main/docs/:path'
    )
  })

  it('handles repo url without protocol by prepending https', () => {
    expect(resolveEditLinkPattern('github.com/user/repo')).toBe(
      'https://github.com/user/repo/edit/main/src/:path'
    )
  })

  it('omits srcDir segment when srcDir is "."', () => {
    expect(resolveEditLinkPattern('https://github.com/user/repo', 'main', '.')).toBe(
      'https://github.com/user/repo/edit/main/:path'
    )
  })
})
