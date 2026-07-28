---
layout: false
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup lang="ts">
import { useData, inBrowser } from 'vitepress'
import { onMounted } from 'vue'
import { resolveNavigatorLang } from 'vitepress-theme-neptu/utils/client'

const { site } = useData()
const supportedLocales = Object.keys(site.value.locales)
  .filter((item) => item !== 'root')
const base = site.value.base || '/'

onMounted(() => {
  if (inBrowser && window.location.pathname === base) {
    const langToRedirect =
      (supportedLocales.length && resolveNavigatorLang(navigator, supportedLocales)) || 'en'

    window.location.replace(base + langToRedirect + '/')
  }
})
</script>
