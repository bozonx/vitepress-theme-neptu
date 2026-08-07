// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import {
  getLightboxElements,
  buildLightboxItems,
  getClickedLightboxIndex,
  addBodyClass,
  removeBodyClass,
  hasBodyClass,
} from '../../../../src/utils/client/lightboxDom.ts'

function makeDoc(html: string): Document {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}

describe('getLightboxElements', () => {
  it('returns empty array when no lightbox links exist', () => {
    const doc = makeDoc('<div><a href="/a">link</a></div>')
    expect(getLightboxElements(doc)).toEqual([])
  })

  it('collects all a.lightbox elements', () => {
    const doc = makeDoc(`
      <a class="lightbox" href="/a.jpg"><img src="/a.jpg" alt="A" /></a>
      <a class="lightbox" href="/b.jpg"><img src="/b.jpg" alt="B" /></a>
    `)
    const links = getLightboxElements(doc)
    expect(links).toHaveLength(2)
    expect(links[0]!.getAttribute('href')).toBe('/a.jpg')
    expect(links[1]!.getAttribute('href')).toBe('/b.jpg')
  })

  it('ignores links without lightbox class when not in doc content', () => {
    const doc = makeDoc(`
      <a href="/a.jpg">link</a>
      <a class="lightbox" href="/b.jpg">img</a>
    `)
    const links = getLightboxElements(doc)
    expect(links).toHaveLength(1)
    expect(links[0]!.getAttribute('href')).toBe('/b.jpg')
  })

  it('collects standalone images inside post body (.vp-doc)', () => {
    const doc = makeDoc(`
      <div class="vp-doc">
        <img src="/resolved-body.jpg" alt="Body Image" />
        <a href="https://example.com"><img src="/external-link.jpg" alt="External Link" /></a>
      </div>
    `)
    const links = getLightboxElements(doc)
    expect(links).toHaveLength(1)
    expect(links[0]!.getAttribute('src')).toBe('/resolved-body.jpg')
  })

  it('collects body images wrapped by mdImage where lightbox class was overwritten by externalLinks', () => {
    const doc = makeDoc(`
      <div class="vp-doc">
        <a href="https://example.com/photo.jpg" class="vp-external-link-icon" target="_blank" rel="noreferrer">
          <img src="https://example.com/photo.jpg" alt="External Photo" loading="lazy" decoding="async" tabindex="0" />
        </a>
      </div>
    `)
    const links = getLightboxElements(doc)
    expect(links).toHaveLength(1)
    expect(links[0]!.tagName).toBe('IMG')
    expect(links[0]!.getAttribute('src')).toBe('https://example.com/photo.jpg')
  })

  it('does not collect images inside regular content links (href differs from src)', () => {
    const doc = makeDoc(`
      <div class="vp-doc">
        <a href="https://example.com/other-page"><img src="https://example.com/photo.jpg" alt="Link Photo" /></a>
      </div>
    `)
    const links = getLightboxElements(doc)
    expect(links).toHaveLength(0)
  })
})

describe('buildLightboxItems', () => {
  it('builds items from anchor elements', () => {
    const doc = makeDoc(`
      <a class="lightbox" href="/a.jpg"><img src="/a.jpg" alt="Alpha" /></a>
      <a class="lightbox" href="/b.jpg"><img src="/b.jpg" alt="Beta" /></a>
    `)
    const links = getLightboxElements(doc)
    const items = buildLightboxItems(links)
    expect(items).toEqual([
      { src: '/a.jpg', alt: 'Alpha' },
      { src: '/b.jpg', alt: 'Beta' },
    ])
  })

  it('resolves relative href using img src when href is relative', () => {
    const doc = makeDoc(`
      <a class="lightbox" href="./relative-photo.jpg">
        <img src="/blog/assets/relative-photo.hash.jpg" alt="Relative" />
      </a>
    `)
    const links = getLightboxElements(doc)
    const items = buildLightboxItems(links)
    expect(items).toEqual([
      { src: '/blog/assets/relative-photo.hash.jpg', alt: 'Relative' },
    ])
  })

  it('falls back to empty alt when img has no alt', () => {
    const doc = makeDoc(`<a class="lightbox" href="/a.jpg"><img src="/a.jpg" /></a>`)
    const links = getLightboxElements(doc)
    const items = buildLightboxItems(links)
    expect(items).toEqual([{ src: '/a.jpg', alt: '' }])
  })

  it('falls back to empty alt when no img child exists', () => {
    const doc = makeDoc(`<a class="lightbox" href="/a.jpg">text</a>`)
    const links = getLightboxElements(doc)
    const items = buildLightboxItems(links)
    expect(items).toEqual([{ src: '/a.jpg', alt: '' }])
  })
})

describe('getClickedLightboxIndex', () => {
  it('returns -1 for non-element target', () => {
    expect(getClickedLightboxIndex(null, [])).toBe(-1)
    expect(getClickedLightboxIndex(window, [])).toBe(-1)
  })

  it('returns index when click is directly on a lightbox link', () => {
    const doc = makeDoc(`
      <a class="lightbox" href="/a.jpg">img1</a>
      <a class="lightbox" href="/b.jpg">img2</a>
    `)
    const links = getLightboxElements(doc)
    const target = links[1]!
    expect(getClickedLightboxIndex(target, links)).toBe(1)
  })

  it('returns index when click is on a child of a lightbox link', () => {
    const doc = makeDoc(`
      <a class="lightbox" href="/a.jpg"><img src="/a.jpg" /></a>
      <a class="lightbox" href="/b.jpg"><img src="/b.jpg" /></a>
    `)
    const links = getLightboxElements(doc)
    const target = links[1]!.querySelector('img')!
    expect(getClickedLightboxIndex(target, links)).toBe(1)
  })

  it('returns index when click is on a post body standalone image', () => {
    const doc = makeDoc(`
      <div class="vp-doc">
        <img src="/body1.jpg" alt="Body 1" />
      </div>
    `)
    const links = getLightboxElements(doc)
    const target = doc.querySelector('img')!
    expect(getClickedLightboxIndex(target, links)).toBe(0)
  })

  it('returns index when click is on an image inside a non-lightbox anchor with matching href', () => {
    const doc = makeDoc(`
      <div class="vp-doc">
        <a href="https://example.com/photo.jpg" class="vp-external-link-icon" target="_blank">
          <img src="https://example.com/photo.jpg" alt="External Photo" />
        </a>
      </div>
    `)
    const links = getLightboxElements(doc)
    const target = doc.querySelector('img')!
    expect(getClickedLightboxIndex(target, links)).toBe(0)
  })

  it('returns -1 when click is outside any lightbox link', () => {
    const doc = makeDoc(`<div><span>text</span></div>`)
    const target = doc.querySelector('span')!
    expect(getClickedLightboxIndex(target, [])).toBe(-1)
  })
})

describe('body class helpers', () => {
  it('adds and removes class on body', () => {
    const doc = makeDoc('<html><body></body></html>')
    expect(hasBodyClass(doc, 'modal-open')).toBe(false)
    addBodyClass(doc, 'modal-open')
    expect(hasBodyClass(doc, 'modal-open')).toBe(true)
    removeBodyClass(doc, 'modal-open')
    expect(hasBodyClass(doc, 'modal-open')).toBe(false)
  })
})
