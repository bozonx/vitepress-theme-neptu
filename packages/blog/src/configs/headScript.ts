/**
 * Storage keys and attributes of the two theme axes.
 *
 * Duplicated here as literals rather than imported from the composables: this
 * module runs in the Node config, and the composables pull in `vue`. The
 * composables export the same constants (`COLOR_STORAGE_KEY`,
 * `STYLE_STORAGE_KEY`) and the unit tests assert that the two stay in sync.
 */
export const COLOR_STORAGE_KEY = 'neptu-color-theme'
export const COLOR_ATTRIBUTE = 'data-theme'
export const STYLE_STORAGE_KEY = 'neptu-style-preset'
export const STYLE_ATTRIBUTE = 'data-style'

/**
 * Inline script that restores both theme axes before the first paint.
 *
 * A saved visitor choice wins over the configured default; with neither, the
 * attribute is left off and the stylesheet defaults apply. Without this script
 * the page would paint the default theme first and then snap to the saved one.
 *
 * Both themes inject it from their config merge — the blog through
 * `mergeBlogConfig`, the landing through `createLandingHeadScript`, which
 * wraps this one.
 */
export function createThemeHeadScript(options?: {
  colorTheme?: string
  stylePreset?: string
  /** Extra statements appended inside the same try block. */
  extra?: string
}): string {
  const color = JSON.stringify(options?.colorTheme ?? '')
  const style = JSON.stringify(options?.stylePreset ?? '')

  return (
    `(function(){try{var d=document.documentElement;` +
    `${options?.extra ?? ''}` +
    `var c=localStorage.getItem(${JSON.stringify(COLOR_STORAGE_KEY)})||${color};` +
    `if(c)d.setAttribute(${JSON.stringify(COLOR_ATTRIBUTE)},c);` +
    `var s=localStorage.getItem(${JSON.stringify(STYLE_STORAGE_KEY)})||${style};` +
    `if(s)d.setAttribute(${JSON.stringify(STYLE_ATTRIBUTE)},s);}catch(e){}})()`
  )
}

/**
 * Inline script that sets `dir` on `<html>` before the first paint, based on
 * the current URL path and the locale-to-dir map.
 *
 * VitePress sets `<html lang>` per locale but does not set `dir`. Without this
 * script the page would paint LTR and then snap to RTL on client-side mount.
 * The composable `useLocaleDir` handles subsequent client-side navigations.
 */
export function createDirHeadScript(
  localeDirs: Record<string, string>
): string {
  const map = JSON.stringify(localeDirs)

  return (
    `(function(){try{` +
    `var m=${map};` +
    `var p=location.pathname.replace(/^\\/+/,'').split('/')[0];` +
    `var dir=m[p]||m['root']||'';` +
    `if(dir)document.documentElement.setAttribute('dir',dir);` +
    `}catch(e){}})()`
  )
}
