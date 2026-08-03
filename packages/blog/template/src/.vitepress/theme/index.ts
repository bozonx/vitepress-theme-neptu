// Pagefind search UI style overrides (fixes z-index and modal backdrop).
import 'vitepress-theme-neptu/pagefind-fix.css'

import Layout from './Layout.vue'
import Theme from 'vitepress-theme-neptu'
import './styles.css'

export default {
  Layout,
  extends: Theme,
}
