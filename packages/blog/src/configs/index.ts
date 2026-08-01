// Public **server-only** configs barrel.
// Import from `vitepress-theme-neptu/configs` only in your
// `.vitepress/config.js` and data loaders (Node side).
//
// Pulls server-only deps (gray-matter, image-size, remark,
// feed, ...). Do not import from .vue / markdown files.

export {
  common as blogCommonConfig,
  defineBlogConfig,
  defineBlogConfigSync,
  mergeBlogConfig,
} from './blogConfigBase.ts'
export {
  defineSiteConfig,
  defineLocaleConfig,
  defineAuthorsList,
  type SiteYamlConfig,
} from './defineSite.ts'
export {
  createThemeHeadScript,
  COLOR_STORAGE_KEY,
  COLOR_ATTRIBUTE,
  STYLE_STORAGE_KEY,
  STYLE_ATTRIBUTE,
} from './headScript.ts'
export { createConsentHeadScript } from './consentHeadScript.ts'
export { autoLoadLocales } from '../utils/node/index.ts'
export { createSiteYamlHotReloadPlugin } from '../utils/node/hotReloadPlugin.ts'
export { resolveTranslationsByFilePath } from '../utils/shared/index.ts'
export { getImageDimensions } from '../utils/node/index.ts'
