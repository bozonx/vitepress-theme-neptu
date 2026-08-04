---
title: Все поля frontmatter
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
# layout — необязателен для постов: если не указан, страница рендерится как пост.
# Доступные встроенные: post, home, page, util, tag, category, archive, author.
# layout: post
# ID автора из themeConfig.authors. Если ID не найден — блок автора не рендерится.
# Важнно точно и без ошибок указывать ID автора чтобы правльно сформировались списки постов по авторам.
authorId: ivan-k
# URL обложки. Поддерживает URL и co-located пути: ./media/cover.jpg —
# автоматически разрешается в site-root путь (/ru/post/.../media/cover.jpg).
cover: https://images.unsplash.com/photo-...
# Если не указать — автоматически вычисляются из локального файла.
# Для внешних URL (https://...) нужно указывать вручную чтобы избежать прыгания контента при загрузке картинок.
coverWidth: 1200
coverHeight: 800
# alt-текст для <img> и og:image:alt. Обычный текст, без markdown.
coverAlt: Аккуратный стол с клавиатурой, блокнотом и растением
# Подпись под обложкой. В отличие от coverAlt — поддерживает markdown,
# который преобразуется в HTML на этапе сборки.
coverDescr: "coverDescr поддерживает **markdown** и [ссылки](https://unsplash.com)."
# URL обсуждения (GitHub Discussions, Disqus и т.п.) — кнопка в подвале поста.
commentLink: https://github.com/.../discussions
# Кнопка «Смотреть видео» вверху поста. Внешний URL (YouTube, Vimeo и т.п.).
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
# Язык видео — короткая подпись рядом с кнопкой (например: RU, EN).
videoLinkLang: RU
# Язык подкаста — короткая подпись рядом с кнопкой.
podcastLang: RU
# Платформа → URL эпизода. Ключи — произвольные имена платформ.
# Рендерится как выпадающий список вверху поста.
podcasts:
  spotify: https://open.spotify.com/
  applepodcasts: https://podcasts.apple.com/
  youtube: https://www.youtube.com/
# Карта переводов: код локали → относительный путь.
# Используется переключателем языков в шапке И hreflang-тегами для SEO.
# Если не указать — переключатель пытается найти тот же путь в другой локали.
translations:
  en: /en/post/full-featured
# Дата публикации. Строка или Date. Используется для сортировки постов,
# article:published_time в OG и datePublished в JSON-LD.
date: 2026-07-29
# category — синтаксический сахар для одной категории.
# На этапе сборки объединяется с categories и удаляется.
# Дубликаты по slug отбрасываются, так что category + categories с одним slug
# не дадут двойной чип.
category: { name: 'Контент', slug: 'writing' }
# Список категорий. Каждая — строка или { name, slug }.
# Если slug не указан — генерируется из name транслитерацией с учётом локали.
categories:
  - { name: 'Контент', slug: 'writing' }
# Теги. Аналогично категориям: строка или { name, slug }.
# slug генерируется транслитерацией, если не указан явно.
tags: [frontmatter]
# Использовать description как текст превью в карточках списков постов.
# Приоритет: previewText > descrAsPreview > авто-экстракт из контента.
descrAsPreview: true
# Явный текст превью. Имеет высший приоритет — перекрывает descrAsPreview.
# Пустая строка ('') отключает превью, а не игнорируется.
previewText: 'Кастомный текст превью для карточки списка постов.'
# Помечает пост для коллекций избранных (FeaturedList, HomeFeaturedPosts).
# НЕ влияет на хронологические списки — пост остаётся на своём месте по дате.
featured: true
# Включить/выключить бейдж времени чтения для этой страницы.
# Перекрывает themeConfig.readingTime.layouts.
readingTime: true
# Показать/скрыть правую боковую колонку для этой страницы.
# Перекрывает themeConfig.asideLayouts. Игнорируется на главной странице.
aside: true
# Показать/скрыть оглавление для этой страницы.
# Перекрывает themeConfig.toc.layouts, но порог по количеству заголовков
# (themeConfig.toc.minHeadings) всё равно применяется.
toc: true
# Включить/выключить рекламные слоты для этой страницы.
# Перекрывает themeConfig.ads.layouts. Влияет и на in-content слоты,
# которые вставляются markdown-плагином на этапе сборки.
ads: false
# Включить страницу в индекс поиска (Pagefind).
# Для постов по умолчанию true, для util-страниц — false (нужно явно true).
# draft: true принудительно сбрасывает это в false.
searchIncluded: true
# Канонический URL. Принимает полный URL или 'self' для авто-каноникала.
# Если не указан и seo.autoCanonical !== false — генерируется self-каноникал.
canonical: https://example.com/canonical-url
# Покомандное управление SEO. Каждый ключ отключает соответствующую фичу,
# если установлен в false. По умолчанию всё включено.
# Перекрывает глобальные themeConfig.seo.
seo:
  og: true              # Open Graph + Twitter Card мета-теги
  jsonLd: true          # JSON-LD структурированные данные
  hreflang: true        # hreflang link-теги (только если >1 локали)
  canonical: true       # canonical link-тег
  autoCanonical: true   # авто-каноникал, если поле canonical не задано
  rss: true             # RSS/Atom/JSON feed link-теги на главной
  maxDescriptionLength: 160  # лимит символов для авто-экстракта description
# Черновик. Страница собирается (URL работает для превью),
# но исключается из списков, RSS, sitemap, поиска и помечается noindex.
# В vitepress dev черновики видны по умолчанию, в production — скрыты.
# draft: true
# Имя компонента для замены центральной области контента.
# В отличие от layout — заменяет только Content, а не весь layout.
# Если не указан — fallback на frontmatter.layout.
# Компонент должен быть глобально зарегистрирован.
# contentLayout: MyCustomContent
# Кастомный JSON-LD в виде JSON-строки. Мерджится с авто-генерируемым
# JSON-LD (не заменяет!) — поля кастомного объекта перезаписывают стандартные.
# jsonLd: '{"@context":"https://schema.org","@type":"BlogPosting"}'
---
```

Каждое поле разбирается отдельно в тематических постах раздела «Контент»:
[обложки](cover-and-images), [медиа-компоненты](media-components),
[автор, видео и подкасты](author-video-podcast),
[превью и поиск](preview-and-search) и [футер поста](post-footer-and-sharing).
Поля `draft` и `readingTime` разбираются в
[Черновиках и времени чтения](drafts-and-reading-time).
