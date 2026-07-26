import { STYLE_STORAGE_KEY } from '../composables/useLandingStyle.ts'

/** Storage key of the color axis — owned by the blog theme's `useColorTheme`. */
export const COLOR_STORAGE_KEY = 'neptu-color-theme'

/**
 * Inline script injected into `<head>` by `mergeLandingConfig`.
 *
 * It runs before the first paint and does two things:
 *  - restores the saved color theme and style preset, so the page never flashes
 *    the default theme on load;
 *  - marks the document with `ln-js`, which is what arms the scroll-reveal
 *    animations. Without JS the content stays visible instead of hidden.
 */
export function createLandingHeadScript(options?: {
  colorTheme?: string
  landingStyle?: string
}): string {
  const color = JSON.stringify(options?.colorTheme ?? '')
  const style = JSON.stringify(options?.landingStyle ?? '')

  return (
    `(function(){try{var d=document.documentElement;d.classList.add('ln-js');` +
    `var c=localStorage.getItem(${JSON.stringify(COLOR_STORAGE_KEY)})||${color};` +
    `if(c)d.setAttribute('data-theme',c);` +
    `var s=localStorage.getItem(${JSON.stringify(STYLE_STORAGE_KEY)})||${style};` +
    `if(s)d.setAttribute('data-ln-style',s);}catch(e){}})()`
  )
}
