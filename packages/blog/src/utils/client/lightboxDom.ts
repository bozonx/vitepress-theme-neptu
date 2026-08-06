import type { LightboxItem } from '../../composables/useLightbox.ts'

/**
 * Collect all anchor elements with the `lightbox` class from a Document.
 * This is extracted from the composable so it can be unit-tested
 * with a fake DOM implementation.
 */
export type LightboxElement = HTMLAnchorElement | HTMLImageElement

/**
 * Collect all lightbox-eligible elements (a.lightbox anchors and content images) from a Document.
 * This is extracted from the composable so it can be unit-tested
 * with a fake DOM implementation.
 */
export function getLightboxElements(doc: Document): LightboxElement[] {
  const result: LightboxElement[] = []

  const lightboxAnchors = Array.from(
    doc.querySelectorAll<HTMLAnchorElement>('a.lightbox')
  )
  const contentImages = Array.from(
    doc.querySelectorAll<HTMLImageElement>(
      '.vp-doc img, .content-page img, article img'
    )
  )

  for (const img of contentImages) {
    const parentAnchor = img.closest('a')
    if (!parentAnchor) {
      if (!result.includes(img)) {
        result.push(img)
      }
    } else if (parentAnchor.classList.contains('lightbox')) {
      if (!result.includes(parentAnchor)) {
        result.push(parentAnchor)
      }
    } else {
      // The mdImage plugin wraps standalone body images in <a class="lightbox"
      // href="<img-src>">, but VitePress's externalLinks processing overwrites
      // the class for external URLs. Detect this case by comparing the anchor's
      // href to the image's src and treat the image as lightbox-eligible.
      const anchorHref = parentAnchor.getAttribute('href') || ''
      const imgSrc = img.getAttribute('src') || ''
      if (anchorHref && imgSrc && anchorHref === imgSrc) {
        if (!result.includes(img)) {
          result.push(img)
        }
      }
    }
  }

  for (const anchor of lightboxAnchors) {
    if (!result.includes(anchor)) {
      result.push(anchor)
    }
  }

  return result
}

/**
 * Build the lightbox item list from a list of elements.
 */
export function buildLightboxItems(elements: LightboxElement[]): LightboxItem[] {
  return elements.map((el) => {
    const isImg =
      (typeof HTMLImageElement !== 'undefined' &&
        el instanceof HTMLImageElement) ||
      el.tagName === 'IMG'

    if (isImg) {
      const img = el as HTMLImageElement
      const rawSrc = img.getAttribute('src') || ''
      const isRelative =
        !!rawSrc &&
        !rawSrc.startsWith('/') &&
        !rawSrc.startsWith('http://') &&
        !rawSrc.startsWith('https://') &&
        !rawSrc.startsWith('data:')

      const src = isRelative
        ? img.getAttribute('src') || img.currentSrc || img.src || rawSrc
        : rawSrc || img.currentSrc || img.src || ''

      const imgWidth = img.getAttribute('width')
      const imgHeight = img.getAttribute('height')

      return {
        src,
        alt: img.getAttribute('alt') || '',
        width: imgWidth ? Number(imgWidth) : undefined,
        height: imgHeight ? Number(imgHeight) : undefined,
      }
    }

    const anchor = el as HTMLAnchorElement
    const img = anchor.querySelector('img')
    const rawHref = anchor.getAttribute('href') || ''
    const isRelative =
      !!rawHref &&
      !rawHref.startsWith('/') &&
      !rawHref.startsWith('http://') &&
      !rawHref.startsWith('https://') &&
      !rawHref.startsWith('data:')

    const src = isRelative
      ? img?.getAttribute('src') || img?.currentSrc || img?.src || anchor.href || rawHref
      : rawHref || img?.getAttribute('src') || img?.currentSrc || img?.src || ''

    const imgWidth = img?.getAttribute('width')
    const imgHeight = img?.getAttribute('height')

    return {
      src,
      alt:
        img?.getAttribute('alt') ||
        anchor.getAttribute('aria-label') ||
        anchor.getAttribute('title') ||
        '',
      width: imgWidth ? Number(imgWidth) : undefined,
      height: imgHeight ? Number(imgHeight) : undefined,
    }
  })
}

/**
 * Find the index of the clicked link inside the pre-collected list.
 */
export function getClickedLightboxIndex(
  target: EventTarget | null,
  links: LightboxElement[]
): number {
  if (typeof Element === 'undefined' || !(target instanceof Element)) return -1

  const anchor = target.closest('a.lightbox')
  if (anchor && links.includes(anchor as HTMLAnchorElement)) {
    return links.indexOf(anchor as HTMLAnchorElement)
  }

  const img = target.closest('img')
  if (img) {
    if (links.includes(img as HTMLImageElement)) {
      return links.indexOf(img as HTMLImageElement)
    }
    const parentAnchor = img.closest('a.lightbox')
    if (parentAnchor && links.includes(parentAnchor as HTMLAnchorElement)) {
      return links.indexOf(parentAnchor as HTMLAnchorElement)
    }
  }

  return -1
}

/**
 * Add a CSS class to the document body.
 */
export function addBodyClass(doc: Document, className: string): void {
  doc.body.classList.add(className)
}

/**
 * Remove a CSS class from the document body.
 */
export function removeBodyClass(doc: Document, className: string): void {
  doc.body.classList.remove(className)
}

/**
 * Check whether the document body has a given CSS class.
 */
export function hasBodyClass(doc: Document, className: string): boolean {
  return doc.body.classList.contains(className)
}

