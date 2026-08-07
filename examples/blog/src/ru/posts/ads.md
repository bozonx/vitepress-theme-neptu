---
title: Рекламные блоки
description: >
  Подключение компонента, три места размещения и вставка внутрь текста на этапе сборки.
authorId: ivan-k
date: 2026-07-05
category: integration
tags: [advanced, config]
descriptionAsPreview: true
---

Тема не содержит рекламного компонента и не привязана к сети. Она берёт на себя
размещение, резерв высоты, подпись «Реклама» и связь с согласием — а сам код
блока вы пишете сами и подключаете через `ads.component`.

Блоки внутри контента подставляются **на этапе сборки**, плагином `markdown-it`. Разметка VitePress компилируется в Vue-шаблон, поэтому тема вставляет `<NeptuAd />` прямо в HTML статьи.

Место, куда попадает блок в правой колонке, описано в
[Настройках themeConfig](themeconfig-settings#оглавление-и-правая-колонка).

## Подключение

```vue
<!-- .vitepress/theme/AdUnit.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'

// `placement` и `index` приходят от темы — по ним можно выбрать формат.
defineProps<{ placement?: string; index?: number }>()

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
  />
</template>
```

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-neptu'
import AdUnit from './AdUnit.vue'

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp?.(ctx)
    ctx.app.component('AdUnit', AdUnit)
  },
}
```

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  themeConfig: {
    ads: { component: 'AdUnit' },
  },
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

Компонент регистрируется глобально, потому что блоки внутри текста
подставляются на этапе сборки — импортировать их в каждой статье нельзя.

::: tip Смена страницы
VitePress — SPA. Тема сама привязывает блок к маршруту через `:key`, поэтому при
переходе между постами компонент пересоздаётся и `onMounted` срабатывает заново.
Вручную ничего делать не нужно.
:::

## Настройка рекламы

```ts
themeConfig: {
  ads: {
    component: 'AdUnit',
    layouts: ['post'],
    aside: true,
    afterContent: false,
    inContent: {
      enabled: true,
      anchor: 'heading',
      start: 2,
      every: 3,
      max: 2,
      minBlocks: 6,
    },
  },
}
```

### Параметры `ads`

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Главный переключатель. Frontmatter `ads: true \| false` на странице перекрывает это значение. |
| `component` | `string` | — | Имя глобально зарегистрированного компонента, который рендерит рекламный блок. Получает props `placement` и `index`. Без него `NeptuAd` рендерит только содержимое default-слота. |
| `layouts` | `string[]` | `['post']` | Layout-ы, на которых разрешены рекламные слоты. Доступные: `'post'`, `'page'`, `'util'`, `'tag'`, `'category'`, `'archive'`, `'author'` |
| `defaultLayout` | `string` | `'post'` | Layout, который считается активным, если frontmatter страницы не указывает `layout`. |
| `aside` | `boolean` | `true` | Блок в правой колонке. |
| `afterContent` | `boolean` | `false` | Блок под телом статьи, перед футером поста. |
| `requireConsent` | `boolean` | `false` | Не рендерить блок, пока посетитель не дал согласие. |
| `label` | `string` | перевод `adLabel` | Подпись над блоком. Пустая строка убирает подпись. |
| `minHeight` | `Partial<Record<'aside' \| 'in-content' \| 'after-content', number>>` | — | Зарезервированная высота в пикселях для каждого размещения, чтобы блок не сдвигал вёрстку. |

### Параметры `ads.inContent`

| Параметр | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Включить автоматические блоки внутри текста. |
| `anchor` | `'heading' \| 'paragraph'` | `'heading'` | К чему привязывать слот: `'heading'` — перед заголовком `##`, `'paragraph'` — перед абзацем. |
| `start` | `number` | `2` | Порядковый номер первого якоря (1-индексация), перед которым ставится блок. |
| `every` | `number` | `3` | Сколько якорей пропустить между блоками. |
| `max` | `number` | `2` | Максимальное количество блоков на страницу. |
| `minBlocks` | `number` | `6` | Минимальное количество top-level блоков в статье — короткие посты не затрагиваются. |

## Отключить на странице

```yaml
---
title: Страница без рекламы
ads: false
---
```

Работает и в обратную сторону — `ads: true` там, где по умолчанию выключено.
Frontmatter учитывается и плагином сборки, так что блоки внутри текста тоже не
появятся.

## Что дальше

- [Согласие на куки](consent) — Consent Mode v2, CMP и что требует Google.
- [Аналитика и популярные посты](analytics) — настройка отслеживания просмотров.
- [Настройки themeConfig](themeconfig-settings#оглавление-и-правая-колонка) — геометрия колонки и её слот.
