import { describe, it, expect } from 'vitest'
import {
  getLightboxLinks,
  buildItems,
  getClickIndex,
  addBodyClass,
  removeBodyClass,
  bodyHasClass,
} from '../../../../src/utils/client/lightboxDOM.ts'

function makeDoc(html: string): Document {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}

describe('getLightboxLinks', () => {
  it('returns empty array when no lightbox links exist', () => {
    const doc = makeDoc('<div><a href="/a">link</a></div>')
    expect(getLightboxLinks(doc)).toEqual([])
  })

  it('collects all a.lightbox elements', () => {
    const doc = makeDoc(`
      <a class="lightbox" href="/a.jpg"><img src="/a.jpg" alt="A" /></a>
      <a class="lightbox" href="/b.jpg"><img src="/b.jpg" alt="B" /></a>
    `)
    const links = getLightboxLinks(doc)
    expect(links).toHaveLength(2)
    expect(links[0].getAttribute('href')).toBe('/a.jpg')
    expect(links[1].getAttribute('href')).toBe('/b.jpg')
  })

  it('ignores links without lightbox class', () => {
    const doc = makeDoc(`
      <a href="/a.jpg">link</a>
      <a class="lightbox" href="/b.jpg">img</a>
    `)
    const links = getLightboxLinks(doc)
    expect(links).toHaveLength(1)
    expect(links[0].getAttribute('href')).toBe('/b.jpg')
  })
})

describe('buildItems', () => {
  it('builds items from anchor elements', () => {
    const doc = makeDoc(`
      <a class="lightbox" href="/a.jpg"><img src="/a.jpg" alt="Alpha" /></a>
      <a class="lightbox" href="/b.jpg"><img src="/b.jpg" alt="Beta" /></a>
    `)
    const links = getLightboxLinks(doc)
    const items = buildItems(links)
    expect(items).toEqual([
      { src: '/a.jpg', alt: 'Alpha' },
      { src: '/b.jpg', alt: 'Beta' },
    ])
  })

  it('falls back to empty alt when img has no alt', () => {
    const doc = makeDoc(`<a class="lightbox" href="/a.jpg"><img src="/a.jpg" /></a>`)
    const links = getLightboxLinks(doc)
    const items = buildItems(links)
    expect(items).toEqual([{ src: '/a.jpg', alt: '' }])
  })

  it('falls back to empty alt when no img child exists', () => {
    const doc = makeDoc(`<a class="lightbox" href="/a.jpg">text</a>`)
    const links = getLightboxLinks(doc)
    const items = buildItems(links)
    expect(items).toEqual([{ src: '/a.jpg', alt: '' }])
  })
})

describe('getClickIndex', () => {
  it('returns -1 for non-element target', () => {
    expect(getClickIndex(null, [])).toBe(-1)
    expect(getClickIndex(window, [])).toBe(-1)
  })

  it('returns index when click is directly on a lightbox link', () => {
    const doc = makeDoc(`
      <a class="lightbox" href="/a.jpg">img1</a>
      <a class="lightbox" href="/b.jpg">img2</a>
    `)
    const links = getLightboxLinks(doc)
    const target = links[1]
    expect(getClickIndex(target, links)).toBe(1)
  })

  it('returns index when click is on a child of a lightbox link', () => {
    const doc = makeDoc(`
      <a class="lightbox" href="/a.jpg"><img src="/a.jpg" /></a>
      <a class="lightbox" href="/b.jpg"><img src="/b.jpg" /></a>
    `)
    const links = getLightboxLinks(doc)
    const target = links[1].querySelector('img')!
    expect(getClickIndex(target, links)).toBe(1)
  })

  it('returns -1 when click is outside any lightbox link', () => {
    const doc = makeDoc(`<div><span>text</span></div>`)
    const target = doc.querySelector('span')!
    expect(getClickIndex(target, [])).toBe(-1)
  })
})

describe('body class helpers', () => {
  it('adds and removes class on body', () => {
    const doc = makeDoc('<html><body></body></html>')
    expect(bodyHasClass(doc, 'modal-open')).toBe(false)
    addBodyClass(doc, 'modal-open')
    expect(bodyHasClass(doc, 'modal-open')).toBe(true)
    removeBodyClass(doc, 'modal-open')
    expect(bodyHasClass(doc, 'modal-open')).toBe(false)
  })
})
