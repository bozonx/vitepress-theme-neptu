import Tobii from '@midzer/tobii/dist/tobii.modern.js'
import '@midzer/tobii/dist/tobii.min.css'
import { tobiiLightboxPlugin } from 'vitepress-theme-neptu-blog/components'
import Layout from './Layout.vue'
import 'vitepress-theme-neptu-landing/site-theme-fix.css'
import 'vitepress-theme-neptu-blog/pagefind-fix.css'
import { resolveTranslationsByFilePath } from 'vitepress-theme-neptu-blog/configs'
import './styles.css'

/** @type {import('vitepress').Theme} */
export default {
  Layout,
  enhanceApp(ctx) {
    ctx.app.config.globalProperties.getLocales = () =>
      resolveTranslationsByFilePath(ctx.router.route.path)

    tobiiLightboxPlugin(ctx, Tobii)
  },
}
