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

## Как это сделано

```yaml
---
title: Пост со всеми полями frontmatter
description: >
  Пост-«максимум»: обложка, автор, теги, превью, кнопка видео, выпадающий список
  подкастов и ссылка на обсуждение — всё включено сразу.
layout: post
# Блок автора — подвал поста
authorId: ivan-k
# Обложка и подпись — вверху поста
cover: https://images.unsplash.com/photo-...
coverWidth: 1200
coverHeight: 800
coverAlt: Аккуратный стол с клавиатурой, блокнотом и растением
coverDescr: "coverDescr поддерживает **markdown** и [ссылки](https://unsplash.com)."
# Ссылка на обсуждение — подвал поста
commentLink: https://github.com/.../discussions
# Кнопка видео — вверху поста
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: RU
# Подкасты — вверху поста
podcastLang: RU
podcasts:
  spotify: https://open.spotify.com/
  applepodcasts: https://podcasts.apple.com/
  youtube: https://www.youtube.com/
# Переводы — переключатель языков в шапке
translations:
  en: /en/post/full-featured
date: 2026-07-29
# Теги и категории — шапка и подвал поста
category: { name: 'Контент', slug: 'writing' }
categories:
  - { name: 'Контент', slug: 'writing' }
tags: [frontmatter]
# Превью в карточках списков постов
descrAsPreview: true
previewText: 'Кастомный текст превью для карточки списка постов.'
# Избранный пост — попадает в коллекции избранных
featured: true
# Время чтения — шапка поста
readingTime: true
# Правая колонка и оглавление — боковая панель
aside: true
toc: true
# Рекламные слоты — в контенте и aside
ads: false
# Поиск — пост включён в индекс поиска
searchIncluded: true
# Канонический URL — SEO-метатеги
canonical: https://example.com/canonical-url
# SEO-настройки — og, jsonLd, hreflang, rss
seo:
  og: true
  jsonLd: true
  hreflang: true
  canonical: true
  autoCanonical: true
  rss: true
  maxDescriptionLength: 160
# Черновик — скрыт в продакшене
# draft: true
# Кастомный layout центральной области
# contentLayout: MyCustomContent
# Кастомный JSON-LD — структурированные данные
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
