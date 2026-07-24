// Vendored from vitepress/dist/client/theme-default/styles/components — keeps
// the theme insulated from VitePress internals (dist/ paths are not public API).
// Update on VitePress version bump if needed.
import './styles/vendor/custom-block.css'
import './styles/vendor/vp-code-group.css'
import './styles/vendor/vp-code.css'
import './styles/vendor/vp-doc.css'
import FileDownload from './components/doc-components/FileDownload.vue'
import AudioFile from './components/doc-components/AudioFile.vue'
import YoutubeVideo from './components/doc-components/YoutubeVideo.vue'
import VideoFile from './components/doc-components/VideoFile.vue'
import './styles/vendor/vp-common.css'
import './styles/vendor/vp-icons.css'
import './styles/search-modal.css'
import './styles/blog-vars.css'
import './styles/themes/theme-presets.css'
import './styles/blog-styles.css'

import type { EnhanceAppContext } from 'vitepress'
import { addCollection } from '@iconify/vue'
import NeptuLayout from './layouts/NeptuLayout.vue'
import bundledIcons from './generated/icons-bundle'

export type {
  Author,
  BlogUserConfig,
  DeepPartial,
  ExtendedPageData,
  ExtendedSiteConfig,
  I18n,
  LocaleDefinition,
  Post,
  PostFrontmatter,
  PostLite,
  SeoConfig,
  Tag,
  ThemeConfig,
} from './types.d.ts'

export default {
  Layout: NeptuLayout,
  enhanceApp(ctx: EnhanceAppContext) {
    for (const collection of bundledIcons) {
      addCollection(collection)
    }
    ctx.app.component('FileDownload', FileDownload)
    ctx.app.component('AudioFile', AudioFile)
    ctx.app.component('YoutubeVideo', YoutubeVideo)
    ctx.app.component('VideoFile', VideoFile)
  },
}
