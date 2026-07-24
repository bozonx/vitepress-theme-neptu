---
layout: false
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { useData, inBrowser } from 'vitepress'
import { onMounted } from 'vue'
import { resolveNavigatorLang } from 'vitepress-theme-neptu-blog/utils/client'

const { site } = useData()
const defaultLocale = 'en'
const supportedLocales = Object.keys(site.value.locales || {})
const base = site.value.base || '/'

onMounted(() => {
  if (inBrowser && window.location.pathname === base) {
    const langToRedirect =
      (supportedLocales.length && resolveNavigatorLang(navigator, supportedLocales)) || defaultLocale

    window.location.replace(base + langToRedirect + '/')
  }
})
</script>
