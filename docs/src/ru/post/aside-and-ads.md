---
title: Правая колонка и рекламные блоки
description: >
  Слот aside — правая колонка макета поста под баннеры 300px, настройка страниц
  через asideLayouts и frontmatter, подключение AdSense и рекламы на лендинге.
date: 2025-03-12T09:00:00Z
authorId: ivan-k
tags:
  - guide
  - advanced
  - config
---

# Правая колонка и рекламные блоки

У макета поста есть третья колонка — **aside** справа от текста. Тема не содержит
готового рекламного компонента: она даёт место и правила показа, а что именно там
окажется — баннер, промо-блок, оглавление или форма подписки — решаете вы.

## Как устроена колонка

Колонка появляется **только с ширины окна 1550px**. Ниже этого порога она полностью
скрыта: на более узких экранах она отняла бы ширину у статьи. Внутри контент
прилипает при прокрутке (`position: sticky`), ширина по умолчанию — **300px**,
стандартный размер рекламного баннера.

Колонка выводится, только если выполнены оба условия:

1. вы передали контент в слот `aside`;
2. текущая страница разрешена настройками (см. ниже).

Если слота нет — пустое место не резервируется, статья занимает всю ширину.

## Подключение

Правая колонка наполняется через слот `aside` в вашем `Layout.vue`:

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import Theme from 'vitepress-theme-neptu'
import AdUnit from './AdUnit.vue'

const { Layout } = Theme
</script>

<template>
  <Layout>
    <template #aside>
      <AdUnit />
    </template>
  </Layout>
</template>
```

И этот `Layout.vue` регистрируется в теме:

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-neptu'
import Layout from './Layout.vue'

export default { ...Theme, Layout }
```

## Где показывать колонку

По умолчанию колонка выводится на постах и служебных страницах — то есть везде,
кроме главной и `layout: page`:

| Layout | По умолчанию |
| --- | --- |
| `post` (или layout не указан) | да |
| `util`, `tag`, `archive`, `author` | да |
| `page` | нет |
| `home` | нет, никогда |

### Глобально — `themeConfig.asideLayouts`

Список layout'ов, на которых колонка разрешена. Задайте свой, чтобы сузить или
расширить набор:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    // только в статьях, на страницах тегов и архива — без рекламы
    asideLayouts: ['post'],
  },
})
```

Пустой массив `asideLayouts: []` отключает колонку на всём сайте. В список можно
добавить и имя собственного `contentLayout`.

### На отдельной странице — frontmatter `aside`

Поле `aside` во frontmatter перекрывает `asideLayouts` для конкретной страницы:

```yaml
---
title: Страница без рекламы
aside: false
---
```

```yaml
---
title: Обычная страница, но с колонкой
layout: page
aside: true
---
```

Главная (`layout: home`) — исключение: у неё собственный полноэкранный макет, и
`aside: true` там не действует.

## Рекламный компонент

Компонент вы пишете сами — тема не навязывает рекламную сеть. Пример для Google
AdSense: скрипт загрузчика подключается один раз глобально, а сам блок
инициализируется при монтировании.

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  head: [
    [
      'script',
      {
        async: '',
        crossorigin: 'anonymous',
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX',
      },
    ],
  ],
})
```

```vue
<!-- .vitepress/theme/AdUnit.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // Колонка рендерится только на клиенте и только шире 1550px,
  // поэтому пуш безопасно делать в onMounted.
  try {
    ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
  } catch {
    // блокировщик рекламы — молча игнорируем
  }
})
</script>

<template>
  <ins
    class="adsbygoogle"
    style="display: block; width: 300px; height: 600px"
    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
    data-ad-slot="1234567890"
  />
</template>
```

Несколько блоков подряд просто складываются в колонку:

```vue
<template>
  <Layout>
    <template #aside>
      <AdUnit />
      <NewsletterCard class="mt-6" />
    </template>
  </Layout>
</template>
```

::: tip Смена страницы
VitePress — SPA: при переходе между постами компонент в слоте переиспользуется и
`onMounted` не вызывается заново. Если рекламной сети нужен новый запрос на каждой
странице, привяжите к компоненту ключ маршрута:

```vue
<script setup>
import { useRoute } from 'vitepress'
const route = useRoute()
</script>

<template>
  <Layout>
    <template #aside>
      <AdUnit :key="route.path" />
    </template>
  </Layout>
</template>
```
:::

## Размеры и стили

Геометрия колонки задана CSS-переменными — переопределите их в своём CSS:

| Переменная | По умолчанию | Назначение |
| --- | --- | --- |
| `--aside-width` | `300px` | Ширина колонки |
| `--aside-top` | `100px` | Отступ сверху для sticky-контента |
| `--aside-gap` | `1.5rem` | Отступ между статьёй и колонкой |
| `--aside-padding-x` | `1rem` | Внутренние горизонтальные поля |
| `--aside-breakpoint` | `1550px` | Справочно: порог показа |

```css
/* .vitepress/theme/custom.css */
:root {
  --aside-width: 336px;
  --aside-top: 120px;
}
```

`--aside-breakpoint` — информационная переменная: медиазапросы в CSS не умеют
читать custom properties, поэтому сам порог зашит в компонент. Если нужен другой
брейкпоинт, замените компонент через слот целиком — со своими медиазапросами
внутри.

Для тонкой стилизации доступны классы `.aside-container` (сама колонка) и
`.aside-content` (sticky-обёртка).

## Реклама на лендинге

Тема лендинга построена на стандартной теме VitePress и пробрасывает **все** её
слоты, поэтому реклама подключается штатными средствами VitePress — своего
механизма у темы нет.

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import LandingTheme from 'vitepress-theme-neptu-landing'
import AdUnit from './AdUnit.vue'

const { Layout } = LandingTheme
</script>

<template>
  <Layout>
    <template #aside-ads-before>
      <AdUnit />
    </template>
  </Layout>
</template>
```

```ts
// .vitepress/theme/index.ts
import LandingTheme from 'vitepress-theme-neptu-landing'
import Layout from './Layout.vue'

export default { ...LandingTheme, Layout }
```

Слоты `aside-ads-before` / `aside-ads-after` — специально под рекламу: они
прижимают блок к низу колонки, оставляя оглавление наверху. Есть и остальные:
`aside-top`, `aside-bottom`, `aside-outline-before/after`, `doc-before`,
`doc-after`. Для Carbon Ads вообще ничего писать не нужно — достаточно
`themeConfig.carbonAds`.

Важно: правая колонка лендинга — это колонка оглавления (224px под контент,
показ от 1280px). Управляется она frontmatter'ом `aside: true | false` и
`themeConfig.aside` стандартной темы VitePress, а `asideLayouts` — настройка
только блога.

Подробнее — в разделе «Реклама и правая колонка» документации демо-лендинга.

## Что дальше

- [Расширенные возможности](advanced) — остальные слоты макета, хуки и composables.
- [Компоненты](components) — из чего состоит тема.
