---
title: Рекламные блоки
description: >
  Подключение компонента, три места размещения и вставка внутрь текста на этапе сборки.
authorId: ivan-k
date: 2026-07-05
category: { name: 'Интеграция', slug: 'integration' }
tags: [advanced, config]
descriptionAsPreview: true
---

Тема не содержит рекламного компонента и не привязана к сети. Она берёт на себя
размещение, резерв высоты, подпись «Реклама» и связь с согласием — а сам код
блока вы пишете сами и подключаете через `ads.component`.

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
| `defaultLayout` | `string` | `'post'` (блог) / `'doc'` (лендинг) | Layout по умолчанию, если во frontmatter не указан `layout`. |
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

## Как реклама попадает в середину текста

Блоки внутри контента подставляются **на этапе сборки**, плагином `markdown-it`,
а не скриптом после загрузки страницы. Разметка VitePress компилируется в
Vue-шаблон, поэтому тема вставляет `<NeptuAd />` прямо в HTML статьи.

Это принципиально лучше, чем правка DOM после `onMounted`:

- нет скачка вёрстки, когда блок появляется посреди статьи (CLS);
- нет мигания при переходах между страницами;
- позиция детерминированная, а не зависящая от того, когда отработал скрипт;
- блок попадает в серверный HTML.

Чтобы поставить блок в конкретное место, напишите компонент в markdown руками —
автоматические блоки расставляются независимо от ручных:

```md
Первая часть статьи.

<NeptuAd />

Продолжение.
```

## Резерв высоты

Даже при вставке на сборке сеть возвращает креатив асинхронно. Зарезервируйте
высоту, чтобы абзац под блоком не уезжал вниз:

```ts
themeConfig: {
  ads: {
    minHeight: {
      aside: 600,
      'in-content': 280,
      'after-content': 280,
    },
  },
}
```

## Подпись и согласие

Над блоком выводится подпись из перевода `adLabel` («Реклама»). Своя —
`ads.label`, пустая строка убирает подпись совсем.

`ads.requireConsent: false` по умолчанию: сертифицированная CMP сама
придерживает персонализированную рекламу, а полное скрытие блока отняло бы и
неперсонализированные показы, которые такому посетителю всё ещё можно
показывать. Подробности — в статье [Согласие на куки](consent).

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

## Реклама на лендинге

Этот раздел нужен, только если вы используете второй пакет репозитория —
`vitepress-theme-neptu-landing` (лендинг и документация). Для блога всё
предыдущее уже полное.

Тема лендинга построена на стандартной теме VitePress, и правая колонка там —
это колонка оглавления стандартной темы (224px под контент, показ от 1280px).
Оглавление настраивается через `themeConfig.outline`, а не через `toc`.

Рекламная часть общая с блогом: те же `themeConfig.ads` и тот же `<NeptuAd />`.
По умолчанию блоки включены на страницах документации (`layout: doc`) и
выключены на остальных. Блок в колонке тема ставит в слот `aside-ads-before`
стандартной темы — под оглавлением, чтобы оглавление осталось наверху.

Если нужен полный контроль, передайте слот сами — тогда тема свой блок не
рисует:

```vue
<template>
  <Layout>
    <template #aside-ads-before>
      <MyOwnAd />
    </template>
  </Layout>
</template>
```

Для Carbon Ads писать вообще ничего не нужно — достаточно
`themeConfig.carbonAds` стандартной темы.

## Что дальше

- [Согласие на куки](consent) — Consent Mode v2, CMP и что требует Google.
- [Аналитика и популярные посты](analytics) — настройка отслеживания просмотров.
- [Настройки themeConfig](themeconfig-settings#оглавление-и-правая-колонка) — геометрия колонки и её слот.
