import './styles/site-theme-fix.css'

import type { EnhanceAppContext } from 'vitepress'
import SiteHome from './layouts/SiteHome.vue'

export default {
  Layout: SiteHome,
  enhanceApp(_ctx: EnhanceAppContext) {
    // No additional global components for the landing theme
  },
}
