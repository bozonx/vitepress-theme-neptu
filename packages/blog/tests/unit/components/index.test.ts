import { describe, it, expect } from 'vitest'
import * as components from '../../../src/components/index.ts'

describe('components barrel', () => {
  it('exports post building blocks', () => {
    expect(components).toHaveProperty('PostAuthor')
    expect(components).toHaveProperty('PostComments')
    expect(components).toHaveProperty('PostDate')
    expect(components).toHaveProperty('PostDonateLink')
    expect(components).toHaveProperty('PostFooter')
    expect(components).toHaveProperty('PostImage')
    expect(components).toHaveProperty('PostSimilarList')
    expect(components).toHaveProperty('PostSocialShare')
    expect(components).toHaveProperty('PostTags')
    expect(components).toHaveProperty('PostTopBar')
    expect(components).toHaveProperty('PostVideoLink')
    expect(components).toHaveProperty('PodcastDropdown')
    expect(components).toHaveProperty('PodcastIcon')
  })

  it('exports utility components', () => {
    expect(components).toHaveProperty('HomeHero')
    expect(components).toHaveProperty('TagPostsList')
    expect(components).toHaveProperty('RecentList')
  })

  it('exports doc components', () => {
    expect(components).toHaveProperty('AudioFile')
    expect(components).toHaveProperty('FileDownload')
    expect(components).toHaveProperty('YoutubeVideo')
  })
})
