// Imported from the module rather than the `configs` barrel: the barrel pulls
// in the whole server-side config pipeline, and this file only needs a string
// builder with no dependencies of its own.
import { createThemeHeadScript } from 'vitepress-theme-neptu/src/configs/headScript.ts'

export {
  COLOR_STORAGE_KEY,
  COLOR_ATTRIBUTE,
  STYLE_STORAGE_KEY,
  STYLE_ATTRIBUTE,
  createDirHeadScript,
} from 'vitepress-theme-neptu/src/configs/headScript.ts'

/**
 * Inline script injected into `<head>` by `mergeLandingConfig`.
 *
 * The shared part — restoring the color theme and the style preset before the
 * first paint — comes from the blog package. On top of it the landing marks
 * the document with `ln-js`, which is what arms the scroll-reveal animations:
 * without JS the content stays visible instead of hidden.
 */
export function createLandingHeadScript(options?: {
  colorTheme?: string
  stylePreset?: string
}): string {
  return createThemeHeadScript({
    colorTheme: options?.colorTheme,
    stylePreset: options?.stylePreset,
    extra: `d.classList.add('ln-js');`,
  })
}
