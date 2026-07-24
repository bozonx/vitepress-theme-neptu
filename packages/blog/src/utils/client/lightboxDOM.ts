import type { LightboxItem } from '../../composables/useLightbox.ts'

/**
 * Collect all anchor elements with the `lightbox` class from a Document.
 * This is extracted from the composable so it can be unit-tested
 * with a fake DOM implementation.
 */
export function getLightboxLinks(doc: Document): HTMLAnchorElement[] {
  return Array.from(doc.querySelectorAll('a.lightbox'))
}

/**
 * Build the lightbox item list from a list of anchor elements.
 */
export function buildItems(links: HTMLAnchorElement[]): LightboxItem[] {
  return links.map((el) => ({
    src: el.getAttribute('href') || '',
    alt: el.querySelector('img')?.getAttribute('alt') || '',
  }))
}

/**
 * Find the index of the clicked link inside the pre-collected list.
 */
export function getClickIndex(
  target: EventTarget | null,
  links: HTMLAnchorElement[]
): number {
  if (!(target instanceof Element)) return -1
  const anchor = target.closest('a.lightbox')
  if (!anchor) return -1
  return links.indexOf(anchor as HTMLAnchorElement)
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
export function bodyHasClass(doc: Document, className: string): boolean {
  return doc.body.classList.contains(className)
}
