---
title: Пост со всеми полями frontmatter
description: >
  Пост-«максимум»: обложка, автор, теги, превью, кнопка видео, выпадающий список
  подкастов и ссылка на обсуждение — всё включено сразу.
layout: post
authorId: ivan-k
cover: https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Аккуратный стол с клавиатурой, блокнотом и растением
coverDescr: "coverDescr поддерживает **markdown** и [ссылки](https://unsplash.com)."
commentLink: https://github.com/bozonx/vitepress-theme-neptu/discussions
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: RU
podcastLang: RU
podcasts:
  spotify: https://open.spotify.com/
  applepodcasts: https://podcasts.apple.com/
  youtube: https://www.youtube.com/
translations:
  en: /en/post/full-featured
date: 2026-07-29
category: { name: 'Контент', slug: 'writing' }
categories:
  - { name: 'Контент', slug: 'writing' }
tags: [frontmatter]
descrAsPreview: true
previewText: 'Кастомный текст превью для карточки списка постов.'
featured: true
readingTime: true
aside: true
toc: true
ads: false
searchIncluded: true
canonical: https://example.com/canonical-url
seo:
  og: true
  jsonLd: true
  hreflang: true
  canonical: true
  autoCanonical: true
  rss: true
  maxDescriptionLength: 160
# draft: true
# contentLayout: MyCustomContent
# jsonLd: '{"@context":"https://schema.org","@type":"BlogPosting"}'
---

Это пост-**«максимум»**: включены все необязательные поля frontmatter, чтобы в
одном месте увидеть, как тема рендерит каждое из них — обложка с подписью,
кнопка видео и подкасты сверху, блок автора и теги внизу.

## Что на странице

| Возможность | Поля | Где видно |
| --- | --- | --- |
| Обложка и подпись | `cover`, `coverWidth/Height`, `coverAlt`, `coverDescr` | вверху |
| Блок автора | `authorId` | подвал поста |
| Теги и категории | `tags`, `category`, `categories` | шапка и подвал |
| Превью в списке | `descrAsPreview`, `previewText` | карточки списков |
| Кнопка видео | `videoLink`, `videoLinkLang` | вверху поста |
| Подкасты | `podcasts`, `podcastLang` | вверху поста |
| Ссылка на обсуждение | `commentLink` | подвал поста |
| Время чтения | `readingTime` | шапка поста |
| Избранный пост | `featured` | коллекции избранных |
| Правая колонка | `aside` | боковая панель |
| Оглавление | `toc` | правая колонка |
| Рекламные слоты | `ads` | в контенте и aside |
| Поиск | `searchIncluded` | индекс поиска |
| Канонический URL | `canonical` | SEO-метатеги |
| SEO-настройки | `seo` | og, jsonLd, hreflang, rss |
| Переводы | `translations` | переключатель языков |
| Черновик | `draft` (закомментировано) | скрыт в продакшене |
| Кастомный контент | `contentLayout` (закомментировано) | центральная область |
| Кастомный JSON-LD | `jsonLd` (закомментировано) | структурированные данные |

## Как это сделано

```yaml
---
title: Пост со всеми полями frontmatter
description: >
  Пост-«максимум»: обложка, автор, теги, превью, кнопка видео, выпадающий список
  подкастов и ссылка на обсуждение — всё включено сразу.
layout: post
authorId: ivan-k
cover: https://images.unsplash.com/photo-...
coverWidth: 1200
coverHeight: 800
coverAlt: Аккуратный стол с клавиатурой, блокнотом и растением
coverDescr: "coverDescr поддерживает **markdown** и [ссылки](https://unsplash.com)."
commentLink: https://github.com/.../discussions
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: RU
podcastLang: RU
podcasts:
  spotify: https://open.spotify.com/
  applepodcasts: https://podcasts.apple.com/
  youtube: https://www.youtube.com/
translations:
  en: /en/post/full-featured
date: 2026-07-29
category: { name: 'Контент', slug: 'writing' }
categories:
  - { name: 'Контент', slug: 'writing' }
tags: [frontmatter]
descrAsPreview: true
previewText: 'Кастомный текст превью для карточки списка постов.'
featured: true
readingTime: true
aside: true
toc: true
ads: false
searchIncluded: true
canonical: https://example.com/canonical-url
seo:
  og: true
  jsonLd: true
  hreflang: true
  canonical: true
  autoCanonical: true
  rss: true
  maxDescriptionLength: 160
# draft: true
# contentLayout: MyCustomContent
# jsonLd: '{"@context":"https://schema.org","@type":"BlogPosting"}'
---
```

Поля `draft`, `contentLayout` и `jsonLd` закомментированы, чтобы не мешать
отображению страницы. Раскомментируйте их, когда они нужны.

Каждое поле разбирается отдельно в тематических постах раздела «Контент»:
[обложки](cover-and-images), [медиа-компоненты](media-components),
[автор, видео и подкасты](author-video-podcast),
[превью и поиск](preview-and-search) и [футер поста](post-footer-and-sharing).
Поля `draft` и `readingTime` разбираются в
[Черновиках и времени чтения](drafts-and-reading-time).
