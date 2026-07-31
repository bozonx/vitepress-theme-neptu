---
title: Реклама и правая колонка
description: >
  Как разместить рекламные блоки на страницах документации лендинга — слоты
  стандартной темы VitePress, управление колонкой оглавления и пример AdSense.
---

# Реклама и правая колонка

Своего механизма рекламы у темы лендинга нет — и не нужно. Тема построена на
стандартной теме VitePress и **пробрасывает все её слоты**, поэтому рекламные
блоки подключаются штатными средствами VitePress.

::: tip Блог — отдельная история
В блог-теме Neptu правая колонка своя: фиксированные 300px под баннер, показ от
1550px и настройка `themeConfig.asideLayouts`. Здесь всё иначе — правая колонка
лендинга это колонка оглавления стандартной темы. Не путайте настройки.
:::

## Подключение слота

Оберните `Layout` темы своим компонентом и передайте контент в нужный слот:

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

Тема передаёт слоты в дефолтный `Layout` VitePress без фильтрации, поэтому
доступен весь их набор — не только перечисленные ниже.

## Где размещать

| Слот | Место |
| --- | --- |
| `aside-top` | Вверху правой колонки, над оглавлением |
| `aside-bottom` | Внизу правой колонки |
| `aside-outline-before` | Прямо перед оглавлением |
| `aside-outline-after` | Сразу после оглавления |
| `aside-ads-before` / `aside-ads-after` | Рекламная зона внизу колонки |
| `aside-bottom` | В самом низу колонки |
| `doc-before` | Над контентом страницы |
| `doc-after` | Под контентом, до навигации prev/next |
| `doc-footer-before` | Перед ссылками prev/next |
| `layout-top` / `layout-bottom` | Над и под всей страницей |

Слоты `aside-ads-*` предназначены именно для рекламы: они стоят после
распорки, поэтому блок прижимается к низу колонки, а оглавление остаётся
наверху. Это разумный выбор по умолчанию.

## Carbon Ads из коробки

Для Carbon Ads ничего писать не нужно — стандартная тема рендерит блок сама:

```ts
// .vitepress/config.ts
themeConfig: {
  carbonAds: {
    code: 'your-carbon-code',
    placement: 'your-carbon-placement',
  },
}
```

Блок появится в той же зоне, между `aside-ads-before` и `aside-ads-after`.

## Ширина колонки

Правая колонка стандартной темы уже, чем баннер 300×600: под контент в ней
отведено **224px**, а сама колонка появляется с 1280px ширины окна. Либо берите
узкие форматы (160×600), либо расширьте колонку в своём CSS:

```css
/* .vitepress/theme/custom.css */
@media (min-width: 1280px) {
  .VPDoc .aside {
    max-width: 332px;
  }

  .VPDoc .aside-container,
  .VPDoc .aside-curtain {
    width: 300px;
  }
}
```

Колонка скрывается на узких экранах силами самой VitePress — отдельный
брейкпоинт настраивать не нужно. Учтите, что расширение колонки отнимает место
у контента: проверьте страницы на 1280–1440px.

## Управление показом

Колонка включается стандартными средствами VitePress, а не темой:

```ts
// .vitepress/config.ts
themeConfig: {
  aside: true, // true | false | 'left'
}
```

Отключить на конкретной странице — во frontmatter:

```yaml
---
title: Страница без колонки
aside: false
---
```

На страницах лендинга (`layout: home` и блочные страницы) колонки нет — в этом
демо главная так и объявлена: `aside: false`.

## Пример: AdSense

Загрузчик подключается один раз глобально:

```ts
// .vitepress/config.ts
export default async () => {
  const config: LandingUserConfig = {
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
  }

  return defineLandingConfig(config)
}
```

Сам блок инициализируется при монтировании:

```vue
<!-- .vitepress/theme/AdUnit.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
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
    style="display: block"
    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
    data-ad-slot="1234567890"
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
</template>
```

::: warning Переходы между страницами
VitePress — SPA: при смене страницы компонент в слоте переиспользуется и
`onMounted` не сработает повторно. Если сети нужен новый запрос на каждой
странице, привяжите компонент к маршруту:

```vue
<script setup>
import { useRoute } from 'vitepress'
const route = useRoute()
</script>

<template>
  <Layout>
    <template #aside-ads-before>
      <AdUnit :key="route.path" />
    </template>
  </Layout>
</template>
```
:::
