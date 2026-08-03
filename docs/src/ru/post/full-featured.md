---
title: Пост со всеми полями frontmatter
description: >
  Пост-«максимум»: обложка, автор, теги, превью, кнопка видео, выпадающий список
  подкастов и ссылка на обсуждение — всё включено сразу.
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
tags: [frontmatter]
descrAsPreview: true
---

Это пост-**«максимум»**: включены все необязательные поля frontmatter, чтобы в
одном месте увидеть, как тема рендерит каждое из них — обложка с подписью,
кнопка видео и подкасты сверху, блок автора и теги внизу.

## Что на странице

| Возможность | Поля | Где видно |
| --- | --- | --- |
| Обложка и подпись | `cover`, `coverWidth/Height`, `coverAlt`, `coverDescr` | вверху |
| Блок автора | `authorId` | подвал поста |
| Теги | `tags` | шапка и подвал |
| Превью в списке | `descrAsPreview` | карточки списков |
| Кнопка видео | `videoLink` | вверху поста |
| Подкасты | `podcasts` | вверху поста |
| Ссылка на обсуждение | `commentLink` | подвал поста |
| Время чтения | `readingTime` | шапка поста |

## Как это сделано

```yaml
---
title: Пост со всеми полями frontmatter
date: 2025-05-15T12:00:00Z
authorId: ivan-k
cover: https://images.unsplash.com/photo-...
coverWidth: 1200
coverHeight: 800
coverAlt: Аккуратный стол с клавиатурой, блокнотом и растением
tags: [frontmatter, guide]
descrAsPreview: true
commentLink: https://github.com/.../discussions
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: RU
podcastLang: RU
podcasts:
  spotify: https://open.spotify.com/
  applepodcasts: https://podcasts.apple.com/
  youtube: https://www.youtube.com/
---
```

Каждое поле разбирается отдельно в тематических постах раздела «Контент»:
[обложки](cover-and-images), [медиа-компоненты](media-components),
[автор, видео и подкасты](author-video-podcast),
[превью и поиск](preview-and-search) и [футер поста](post-footer-and-sharing).
Поля `draft` и `readingTime` разбираются в
[Черновиках и времени чтения](drafts-and-reading-time).
