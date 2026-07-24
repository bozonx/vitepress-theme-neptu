// Public **server-only** configs barrel.
// Import from `vitepress-theme-neptu-blog/configs` only in your
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
export { autoLoadLocales } from '../utils/node/index.ts'
export { createSiteYamlHotReloadPlugin } from '../utils/node/hotReloadPlugin.ts'
export { resolveTranslationsByFilePath } from '../utils/shared/index.ts'
export { getImageDimensions } from '../utils/node/index.ts'
