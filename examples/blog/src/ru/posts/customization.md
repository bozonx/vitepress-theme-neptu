---
title: Кастомизация — цветовые схемы, стили, шрифты, хуки, слоты и свои макеты
description: >
  Восемь цветовых схем и шесть стилевых пресетов, собственный оттенок через
  CSS-переменные, светлая и тёмная темы, свои шрифты, иконки, печатная версия
  статьи, трансформ-хуки сборки, слоты макета и собственные макеты.
authorId: ivan-k
date: 2026-08-04
category: { name: 'Продвинутое', slug: 'advanced' }
tags: [theme, config, advanced]
descriptionAsPreview: true
---

Тема поставляется с **восемью** готовыми цветовыми схемами. Выбирают одну из них
одной строкой в YAML — ничего импортировать не нужно. В демо по умолчанию
включена **синяя схема (blue)**, но её можно поменять пикером в верхней панели.

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin:1.5rem 0;">
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(213,66%,46%)"></div><small>blue · hue 213</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(115,70%,37%)"></div><small>green · hue 115</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(270,66%,46%)"></div><small>purple · hue 270</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(30,66%,46%)"></div><small>amber · hue 30</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(180,66%,46%)"></div><small>teal · hue 180</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(345,66%,46%)"></div><small>rose · hue 345</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(320,66%,46%)"></div><small>magenta · hue 320</small></div>
  <div style="text-align:center"><div style="height:56px;border-radius:10px;background:hsl(0,0%,30%)"></div><small>monochrome</small></div>
</div>

## Выбор схемы

Цветовая схема задаётся в файле конфигурации `site.yaml` (или в `themeConfig` в `.vitepress/config.ts`):

```yaml
# site.yaml
themeConfig:
  defaultColorTheme: 'teal' # blue | green | purple | amber | teal | rose | magenta | monochrome
  defaultStylePreset: 'editorial' # soft | sharp | brutal | glass | editorial | mono
```

Импортировать CSS-файлы схем не нужно: базовая тема загружает все пресеты сама, а выбранная схема применяется инлайн-скриптом в `<head>` — без мигания страницы.

## Пикеры темы (`colorPicker`, `stylePicker`)

В теме два рантайм-переключателя — по одному на ось — и оба **выключены по
умолчанию**: блог обычно поставляется с одним выбранным видом, а пикеры нужны
демо-сайтам вроде этого. Включаются независимо:

```ts
// .vitepress/config.ts
export default {
  themeConfig: {
    // Применяется к тем, кто зашёл впервые; сохранённый выбор всегда важнее.
    defaultColorTheme: 'blue',
    defaultStylePreset: 'soft',

    colorPicker: true, // иконка палитры в верхней панели
    stylePicker: true, // иконка форм в верхней панели
  },
}
```

Выбор посетителя пишется в `localStorage` и восстанавливается инлайн-скриптом в
`<head>` до первой отрисовки — мигания чужой темы нет.

Задать `defaultColorTheme` / `defaultStylePreset` достаточно само по себе:
чтобы поменять вид сайта, пикер не нужен.

## Стилевые пресеты (`data-style`)

Цвет — только одна ось. Вторая, **форма**, живёт в отдельном атрибуте
`data-style`, и они свободно комбинируются: `blue` + `brutal` — совсем другой
блог, чем `blue` + `soft`, при тех же постах и компонентах.

| Пресет | Как выглядит |
|--------|--------------|
| `soft` | По умолчанию. Скругления, мягкие тени — обычный вид блога |
| `sharp` | Прямые углы, плоские поверхности |
| `brutal` | Жёсткие рамки 2px, смещённые тени, кнопки капсом |
| `glass` | Полупрозрачные поверхности, блюр, глубокие тени |
| `editorial` | Serif-заголовки, карточки без обвязки, широкий интерлиньяж |
| `mono` | Моноширинный шрифт всюду, тонкие рамки, никаких теней |

Пресеты **общие с темой лендинга** — один и тот же файл
`vitepress-theme-neptu/style-presets.css` одевает оба пакета, поэтому блог и
лендинг на одном домене читаются как один сайт.

Пресет никогда не называет цвет. Он читает мостовые токены, которые тема
определяет под свою палитру (`--neptu-c-ink`, `--neptu-c-surface`,
`--neptu-shadow-*`, …) — именно это позволяет одному файлу обслуживать две
цветовые системы. Чтобы сделать свой, скопируйте встроенный блок и поменяйте
токены формы:

```css
[data-style='compact'] {
  --neptu-radius-md: 0.25rem;
  --neptu-card-shadow: none;
  --neptu-card-shadow-hover: none;
  --neptu-lift: 0px;
  /* … задайте остальной набор токенов, см. комментарий в шапке файла */
}
```

Свои id работают как `defaultStylePreset` или как атрибут `data-style`, который
вы выставляете сами; встроенный пикер показывает только встроенные пресеты.

## Собственный оттенок (Hue)

Каждая схема управляется двумя CSS-переменными. Чтобы задать собственный оттенок,
переопределите их в `.vitepress/theme/styles.css`:

```css
:root {
  --primary-hue: 115; /* акцентный цвет: кнопки, ссылки, активные состояния */
  --layout-hue: 200;  /* нейтральный оттенок интерфейса: рамки, поверхности */
}
```

`--primary-hue` и `--layout-hue` независимы, поэтому вы можете сочетать яркий
акцентный цвет с иначе оттонированным нейтральным интерфейсом.

## Светлое / тёмное оформление

Независимо от цветовой схемы, тема поддерживает светлое и тёмное оформление «из коробки»
— попробуйте переключатель солнце/луна в верхней панели. Каждая схема содержит
описание обоих вариантов, поэтому дополнительная настройка не требуется.

## Пользовательские шрифты

Свои стили живут в `.vitepress/theme/styles.css`. Файл обязательно начинается с двух
импортов — тема стилизована Tailwind v4:

```css
/* .vitepress/theme/styles.css */
@import 'tailwindcss';
@import 'vitepress-theme-neptu/tailwind-source.css';
```

По умолчанию тема использует безопасный веб-стек шрифтов (`Arial, 'Helvetica Neue',
Helvetica, sans-serif` — быстрая загрузка, без сдвига вёрстки). Чтобы использовать свой шрифт,
подключите его в `head` и переопределите две CSS-переменные — ничего больше не требуется,
вся тема применит их автоматически:

```ts
// .vitepress/config.ts — загрузка шрифта
head: [
  ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Fira+Code&display=swap', rel: 'stylesheet' }],
],
```

```css
/* .vitepress/theme/styles.css — применение */
:root {
  --font-body: 'Roboto', ui-sans-serif, system-ui, sans-serif;   /* текст, заголовки, кнопки */
  --vp-font-family-mono: 'Fira Code', ui-monospace, monospace;   /* блоки кода, аудиоплеер */
}
```

Если шрифт нужен только для заголовков, не меняйте `--font-body`, а переопределите `h1…h6`
в `styles.css`.

## Иконки

Каждое поле `icon:` принимает строку [Iconify](https://icon-sets.iconify.design/) вида `prefix:name`,
например `fa6-solid:hand-holding-heart`. Иконки по умолчанию («Поддержать», свежие,
популярное, RSS и т.д.) можно переопределить глобально в `src/site.yaml`:

```yaml
themeConfig:
  donateIcon: 'fa6-solid:hand-holding-heart'
  recentIcon: 'fa6-solid:bolt'
  featuredIcon: 'fa6-solid:bookmark'
  popularIcon: 'fa6-solid:star'
  byDateIcon: 'fa6-solid:calendar-days'
  authorsIcon: 'mdi:users'
  tagsIcon: 'fa6-solid:tag'
  categoriesIcon: 'fa6-solid:folder-open'  # по умолчанию нет — fallback на tagsIcon
  rssIcon: 'bi:rss-fill'
  atomIcon: 'vscode-icons:file-type-atom'
  youtubeIcon: 'fa6-brands:youtube'
```

`categoriesIcon` не имеет собственного умолчания: если поле не задано,
используется `tagsIcon`. `youtubeIcon` применяется в кнопке видео-ссылки поста.

## Фоновое изображение главной страницы

Фон главной — не часть цветовой схемы, а отдельная настройка в YAML. Именно так
сделано это демо:

```yaml
# src/site.yaml
themeConfig:
  home:
    background:
      type: parallax   # none | parallax
      image: 'https://images.unsplash.com/photo-...'
```

Подробнее о блоках главной — в [Домашней странице](home-page).

## Кастомизация главной страницы

YAML-настроек из `themeConfig.home` хватает для большинства сценариев: hero,
секции, фон, внешний вид. Когда нужно больше контроля — тема отдаёт все
строительные блоки главной как отдельные компоненты, а сам макет `BlogHome`
поддерживает слоты.

### Слоты макета `home`

Макет `layout: home` (компонент `BlogHome`) предоставляет два слота для
дополнительного контента:

| Слот | Расположение |
|------|--------------|
| `home-before` | Перед контентной областью (между шапкой и hero/секциями) |
| `home-after` | После контентной области (перед закрытием страницы) |
| `nav-bar-content-before` | В верхней панели, перед её содержимым |

Чтобы воспользоваться ими, оберните `BlogHome` в собственный компонент макета:

```vue
<!-- .vitepress/theme/CustomHome.vue -->
<script setup>
import BlogHome from 'vitepress-theme-neptu/layouts/BlogHome.vue'
import { useScrollY } from 'vitepress-theme-neptu/composables'

const { scrollY } = useScrollY()
</script>

<template>
  <BlogHome :scroll-y="scrollY">
    <template #home-before>
      <MyBanner />
    </template>
    <template #home-after>
      <MyCTA />
    </template>
  </BlogHome>
</template>
```

Зарегистрируйте компонент глобально в `.vitepress/theme/index.ts` и укажите его
в frontmatter:

```yaml
---
layout: CustomHome
---
```

### Сборка из отдельных компонентов

Если нужно полностью контролировать структуру главной, соберите её из отдельных
блоков. Все они экспортируются из `vitepress-theme-neptu/components`:

| Компонент | Что выводит |
|-----------|-------------|
| `HomeHero` | Hero-блок из `home.hero` |
| `HomeSections` | Все секции из `home.sections` разом |
| `HomeFeaturedPosts` | Секция избранных постов |
| `HomeLatestPosts` | Секция последних постов |
| `HomePopularPosts` | Секция популярных постов |
| `HomeTags` | Облако тегов |
| `HomeCategories` | Список категорий |

Пример собственного макета главной:

```vue
<!-- .vitepress/theme/CustomHome.vue -->
<script setup lang="ts">
import { useData } from 'vitepress'
import {
  HomeHero,
  HomeFeaturedPosts,
  HomeLatestPosts,
  HomeTags,
} from 'vitepress-theme-neptu/components'

const { theme } = useData()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Своя шапка или навигация -->
    <header class="w-full sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur">
      <nav class="max-w-3xl mx-auto px-4 sm:px-7 py-3">
        <a href="/">Мой блог</a>
      </nav>
    </header>
    <main class="max-w-3xl mx-auto px-4 sm:px-7 w-full py-12">
      <HomeHero v-if="theme.home?.hero" v-bind="theme.home.hero" />
      <div class="vp-doc"><Content /></div>
      <HomeFeaturedPosts :max-posts="3" />
      <HomeLatestPosts :limit="10" />
      <HomeTags :header="theme.t.tags" :limit="20" />
    </main>
  </div>
</template>
```

Компоненты читают конфигурацию из `themeConfig` через `useThemeConfig()`, поэтому
YAML-настройки (`home.hero`, `home.sections`, `perPage` и т. д.) продолжают
работать — вам не нужно передавать пропсы вручную, если они уже заданы в
конфиге. Пропсы вроде `:max-posts` или `:limit` позволяют переопределить
значения для конкретного макета.

### Полностью свой layout

Если ни `BlogHome`, ни отдельные компоненты не подходят, создайте макет с нуля
и подключите его через `layout` в frontmatter. Тема не накладывает ограничений
на содержимое `index.md` — подойдёт любой Vue-компонент, зарегистрированный
глобально.

Полный справочник экспортируемых компонентов — на странице
[Компонентов](components), раздел «Блоки главной страницы».

## Печать

Настраивать нечего: при печати страницы тема сама скрывает сайдбар, верхнюю
панель, футер сайта, интерактивные блоки под статьёй и кнопки возврата наверх.
Статья занимает всю ширину листа, длинные строки кода переносятся, крупные
медиа-блоки не разрываются между страницами, а у внешних ссылок печатается их
адрес.

Чтобы убрать с печатной версии собственный элемент, добавьте атрибут
`data-print-ignore`:

```html
<aside data-print-ignore>Этот блок нужен только на экране.</aside>
```

## Правая колонка и оглавление

Правая колонка макета поста — третья колонка справа от текста. В ней живёт
оглавление статьи, а под ним — всё, что вы туда положите: рекламный блок, форма
подписки, промо. Настройки видимости и поведения колонки — в [Настройках
themeConfig](themeconfig-settings#оглавление-и-правая-колонка). Здесь —
CSS-переменные и слоты для кастомизации.

### CSS-переменные

Геометрия колонки и оформление задаются CSS-переменными:

| Переменная | По умолчанию | Назначение |
| --- | --- | --- |
| `--aside-width` | `300px` | Ширина колонки |
| `--aside-top` | `100px` | Отступ сверху для sticky-контента |
| `--aside-gap` | `1.5rem` | Отступ между статьёй и колонкой |
| `--aside-padding-x` | `1rem` | Внутренние горизонтальные поля |
| `--aside-breakpoint` | `1550px` | Справочно: порог показа |
| `--toc-indent` | `0.85rem` | Отступ на уровень вложенности |
| `--toc-link-active-color` | цвет ссылки | Активный пункт оглавления |
| `--toc-box-border` | серый | Рамка сворачиваемого блока |
| `--ad-block-margin` | `2.5rem` | Отступы вокруг блока в тексте |
| `--ad-label-color` | серый | Цвет подписи «Реклама» |

```css
/* .vitepress/theme/styles.css */
:root {
  --aside-width: 336px;
  --aside-top: 120px;
}
```

`--aside-breakpoint` — информационная переменная: медиазапросы в CSS не умеют
читать custom properties, поэтому сам порог зашит в компоненты. Если нужен
другой брейкпоинт, переопределите медиазапросы для `.aside-container` и
`.toc-collapsible--auto` в своём CSS.

Классы для тонкой стилизации: `.aside-container`, `.aside-content`,
`.toc-aside`, `.toc-collapsible`, `.toc-link`, `.neptu-ad`.

### Слот `aside`

Если в колонку нужно положить что-то своё — форму подписки, промо-блок, — есть
слот `aside`. Его содержимое рендерится как есть, без рамки и подписи «Реклама»:

```vue
<template>
  <Layout>
    <template #aside>
      <NewsletterCard />
    </template>
  </Layout>
</template>
```

Слот и оглавление уживаются: оглавление остаётся наверху, ваш блок идёт ниже.
Показ колонки на конкретных layout'ах по-прежнему управляется через
`themeConfig.asideLayouts` и frontmatter `aside`.

## Пользовательские трансформ-хуки

Когда настроек из YAML не хватает, тема предоставляет стандартные хуки VitePress
в конфигурации, которую вы передаёте в `defineBlogConfig`. Ваши хуки выполняются
**после** встроенных трансформеров, поэтому вы расширяете, а не заменяете их:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  siteUrl: 'https://myblog.org',

  async transformPageData(pageData, ctx) {
    // Встроенные трансформеры уже выполнились (размеры изображений, заголовок,
    // мета-теги, описание). Добавьте или измените поля здесь.
    pageData.frontmatter.customField = 'value'
  },

  async transformHead(ctx) {
    return [['meta', { name: 'custom', content: 'value' }]]
  },

  async buildEnd(siteConfig) {
    // Выполняется после генерации RSS / robots.txt темой.
  },
})
```

Порядок выполнения для `transformPageData`:

1. Встроенные: `collectImageDimensions` → `transformTitle` → `transformPageMeta` → `resolveDescription`
2. Ваш хук

Нужно запуститься **до** встроенных трансформеров? Используйте [`extends`](https://vitepress.dev/reference/site-config#extends)
в VitePress — хуки из этой конфигурации срабатывают первыми.

## Пользовательский макет поста

Каждый строительный блок поста экспортируется из
`vitepress-theme-neptu/components`, поэтому вы можете собрать собственный макет поста,
сохранив общий интерфейс темы:

```vue
<script setup lang="ts">
import {
  PostDate, PostAuthor, PostImage, PostTags,
  PostSocialShare, PostSimilarList, PostFooter,
} from 'vitepress-theme-neptu/components'
</script>

<template>
  <article>
    <PostDate />
    <PostAuthor />
    <PostImage />
    <div class="vp-doc"><Content /></div>
    <PostTags />
    <PostSocialShare />
    <PostSimilarList />
    <PostFooter />
  </article>
</template>
```

Затем подключите компонент в `.vitepress/theme/index.ts` как глобальный и используйте в frontmatter:

```yaml
---
layout: post
contentLayout: CustomPost
---
```

Разница между двумя полями:

- **`contentLayout`** заменяет только центральную колонку. Сайдбар, верхняя
  панель, оглавление и правая колонка остаются от темы — это то, что нужно в
  большинстве случаев.
- **`layout`** с именем вашего компонента заменяет страницу целиком, вместе с
  обвязкой.

Если правки точечные, не заменяйте макет вовсе — используйте слоты (ниже).

Полный список экспортируемых частей поста (`PostDate`, `PostAuthor`,
`PostImage`, `PostTags`, `PostSocialShare`, `PostSimilarList`, `PostFooter`,
`PostTopBar`, `PostVideoLink`, `PostDonateLink`, `PostComments`,
`PostCategories` и другие) —
в [Справочнике компонентов](components).

## Слоты макета поста

Если нужно добавить лишь небольшие фрагменты UI в стандартный макет поста, используйте слоты
вместо полной замены компонента:

```vue
<!-- .vitepress/theme/Layout.vue -->
<script setup>
import Theme from 'vitepress-theme-neptu'
const { Layout } = Theme
</script>

<template>
  <Layout>
    <template #post-header-before>
      <BreadcrumbNav />
    </template>

    <template #post-content-after>
      <NewsletterSignup />
    </template>
  </Layout>
</template>
```

Доступные слоты внутри стандартного макета поста (`PageContent.vue`):

| Слот | Расположение |
|------|--------------|
| `post-header-before` | До `<header>` (заголовок, дата, topbar) |
| `post-header-after` | После `<header>` |
| `post-content-before` | До markdown `<Content />` |
| `post-content-after` | После markdown `<Content />` |
| `post-footer` | Заменяет весь блок `<PostFooter />` |

Эти слоты есть только у постов. На страницах с `layout: page` и служебных
(`util`, `tag`, `archive`, `author`) выводится лишь `<Content />`, поэтому
`post-*` слоты там не рендерятся.

### Слоты общего макета

Кроме содержимого поста, слоты есть и у обвязки страницы — сайдбара, шапки,
правой колонки и футера. Они передаются в тот же `<Layout>`:

| Слот | Расположение |
|------|--------------|
| `aside` | Правая колонка (реклама, промо) — от 1550px |
| `sidebar-top` | Вверху левого сайдбара, над навигацией |
| `sidebar-middle` | В середине левого сайдбара |
| `sidebar-bottom` | Внизу левого сайдбара, под ссылками |
| `sub-sidebar` | Дополнительная секция сайдбара |
| `nav-bar-content-before` | В верхней панели, перед её содержимым |
| `footer` | Заменяет футер сайта целиком |

Правая колонка настраивается отдельно — какие страницы её показывают, как
подключить рекламу и как поменять размеры, описано в
[Настройках themeConfig](themeconfig-settings#оглавление-и-правая-колонка).

## Кастомизация футера сайта

Футер сайта задаётся через `themeConfig.footer`:

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    footer: {
      message: 'Выпущено под лицензией MIT.',
      copyright: 'Copyright 2026',
      links: [{ text: 'GitHub', href: 'https://github.com/...' }],
    },
  },
})
```

Чтобы полностью заменить футер, используйте слот `footer` в своём `Layout.vue`:

```vue
<template>
  <Layout>
    <template #footer>
      <MySiteFooter />
    </template>
  </Layout>
</template>
```

Когда слот `footer` предоставлен, встроенный футер темы и его отступы не выводятся.
Чтобы убрать футер полностью — не задавайте `themeConfig.footer` и не предоставляйте слот `footer`.

## Кастомизация подвала поста

Состав и порядок блоков подвала задаются массивом `themeConfig.postFooter` —
он разобран в [Настройках themeConfig](themeconfig-settings#подвал-поста). Здесь — что делать,
когда перестановки блоков мало.

### Замена всего подвала

Используйте слот `post-footer` в своём `Layout.vue`:

```vue
<template>
  <Layout>
    <template #post-footer>
      <MyCustomFooter />
    </template>
  </Layout>
</template>
```

### Переопределение отдельных блоков

`PostFooter` предоставляет именованный слот для каждого ключа блока. Передайте свой контент,
чтобы переопределить один блок, не трогая остальные:

```vue
<template>
  <Layout>
    <template #donate>
      <MyCustomDonate />
    </template>
  </Layout>
</template>
```

> Именованные слоты проксируются через `NeptuLayout` → `DefaultLayout` → `PageContent` → `PostFooter`,
> поэтому их можно использовать прямо из вашего `Layout.vue`.

## Предупреждения при сборке

`defineBlogConfig` выводит предупреждения в консоль для частых ошибок конфигурации:

- Отсутствует `siteUrl` — SEO-функции могут генерировать битые URL.
- Пустые `locales` — тема требует хотя бы одну локаль.

Эти предупреждения появляются только при запуске сборки / dev-сервера.

## Что дальше

- [Справочник компонентов](components) — что можно импортировать из темы.
- [Внешний контент](external-content) — контент из CMS или API.
- [Рекламные блоки](ads) — свой компонент в слотах темы.
