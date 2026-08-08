---
title: Все поля frontmatter
description: >
  Все возможности frontmatter: обложка, автор, теги, превью, кнопка видео, выпадающий список
  подкастов и ссылка на обсуждение — всё включено сразу.
layout: post
authorId: ivan-k
translations:
  en: /en/posts/frontmatter
date: 2026-07-29
category: writing
categories:
  - writing
tags: [frontmatter]
descriptionAsPreview: true
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

С помощью fronmatter секции Markdown документа вы можете очень гибко настраивать каждый пост. Frontmatter это блок в начале Markdown файла обрамленный двумя сроками по три минуса `---`, который содержит метаданные поста в формате YAML. Сам этот блок не рендерится на странице, но его данные влияют на отображение поста, SEO и другие аспекты.

Набор доступных полей зависит от значения `layout`. Больше всего их у постов —
с них и начнём, а дальше идут разделы про обычные страницы (`layout: page`) и
главную (`layout: home`), где работает только часть полей.

## Полный пример frontmatter поста

```yaml
---
### Основное ###

# Дата публикации. Строка или Date. Используется для сортировки постов,
# article:published_time в OG и datePublished в JSON-LD.
# Можно указывать как в виде даты в формате `YYYY-MM-DD`,
# так и со временем в формате ISO 8601 `YYYY-MM-DDTHH:mm:ss`,
# например `2026-07-29T12:00:00Z`, где `Z` означает UTC.
# Время имеет смысл указывать если в один день вы публикуете
# несколько постов, для того чтобы сохранить их порядок в списках
# date это единственный обязательный параметр для постов
date: 2026-07-29

# Необязательное переопределение title страницы. По умолчанию оно берется из заголовка первого уровня
title: Все поля frontmatter

# Это попадет в meta description страницы
description: >
  Все возможности frontmatter: обложка, автор, теги, превью, кнопка видео, выпадающий список
  подкастов и ссылка на обсуждение — всё включено сразу.

# layout для постов можно не указывать, по умолчанию всеравно значение 'post'.
#layout: post

# ID автора из themeConfig.authors. Если ID не найден — блок автора не рендерится.
# Важнно точно и без ошибок указывать ID автора чтобы правльно
# сформировались списки постов по авторам.
authorId: ivan-k

### Категории и теги ###

# Значение — это `id` записи из src/<локаль>/_categories.yaml; название и адрес
# берутся оттуда. На этапе сборки поле объединяется с categories и удаляется.
# В большинстве случаев рекомендуется исползвоать именно это поле и
# задавать толко одну категорию для поста
category: writing
# Список категорий — те же id. Рекомендуется указывать более одной категории
# только в крайних случаях, потому что хлебные крошки всеравно строятся по первой категории
categories:
  - writing
# Список тэгов, по которым строится облако тэгов.
# Указывайте список строк по которыым будет автоматически сгенерирован
# slug, либо объектов { name, slug } для ручного определения slug.
# Строки и объекты можно смешивать в одном массиве.
tags: [frontmatter]

### Обложка ###

# URL обложки. Поддерживает URL и co-located пути, например ./media/cover.jpg —
# автоматически разрешается в site-root путь (/ru/posts/.../media/cover.jpg).
cover: https://images.unsplash.com/photo-...
# Размеры обложки. Если не указать — автоматически вычисляются из локального файла.
# Для внешних URL нужно указывать вручную чтобы избежать CLS (Cumulative Layout Shift - прыгание контента при загрузке картинок).
coverWidth: 1200
coverHeight: 800
# alt-текст для <img> и og:image:alt. Обычный текст, без markdown.
coverAlt: Аккуратный стол с клавиатурой, блокнотом и растением
# Подпись под обложкой. В отличие от coverAlt — поддерживает markdown,
# который преобразуется в HTML на этапе сборки.
coverDescription: "coverDescription поддерживает **markdown** и [ссылки](https://unsplash.com)."

### Превью в списках постов ###

# Использовать description как текст превью в карточках списков постов.
# Приоритет: previewText > descriptionAsPreview > авто-экстракт из контента.
# По умолчанию: false (если не задан previewText то берется начало поста для превью)
descriptionAsPreview: false
# Явный текст превью. Имеет высший приоритет — перекрывает descriptionAsPreview.
# Пустая строка ('') отключает превью, а не игнорируется.
previewText: 'Кастомный текст превью для карточки списка постов.'
# Помечает пост для коллекций избранных которые видны на главной странице
# и на отдельной странице избранных постов.
# По умолчанию: false.
featured: false

### Видео, подкасты, обсуждение ###

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
# URL обсуждения (GitHub Discussions, Disqus, Telegram и т.п.) — кнопка в подвале поста.
commentLink: https://github.com/.../discussions

### Элементы страницы ###

# Включить/выключить бейдж времени чтения для этой страницы.
# Перекрывает themeConfig.readingTime.layouts.
# По умолчанию: следует themeConfig.readingTime.layouts.
readingTime: true
# Показать/скрыть правую боковую колонку для этой страницы.
# По умолчанию: следует themeConfig.asideLayouts.
aside: true
# Показать/скрыть оглавление для этой страницы.
# Порог по количеству заголовков (themeConfig.toc.minHeadings)
# всё равно применяется.
# По умолчанию: включено на постах, выключено на остальных layout'ах.
toc: true
# Включить/выключить рекламные слоты для этой страницы.
# Перекрывает themeConfig.ads.layouts. Влияет и на in-content слоты,
# которые вставляются markdown-плагином на этапе сборки.
# По умолчанию: следует themeConfig.ads.layouts.
ads: false

### Публикация и поиск ###

# Черновик. Страница собирается (URL работает для превью),
# но исключается из списков, RSS, sitemap, поиска и помечается noindex.
# В vitepress dev черновики видны по умолчанию, в production — скрыты.
# По умолчанию: false.
draft: false
# Включить страницу в индекс поиска (Pagefind).
# По умолчанию: true для постов и страниц, false для layout: util.
# draft: true принудительно сбрасывает это в false.
searchIncluded: true
# Скрыть ссылку «редактировать страницу» на этом посте.
# Работает только на layout: post и layout: page и только если
# themeConfig.editLink вообще настроен.
# По умолчанию: ссылка показывается.
editLink: false

### SEO ###

# Карта переводов: код локали → относительный путь.
# Используется переключателем языков в шапке И hreflang-тегами для SEO.
# Если не указать — переключатель пытается найти тот же путь в другой локали.
translations:
  en: /en/posts/frontmatter
# Канонический URL. Принимает полный URL или 'self' для авто-каноникала.
# Если не указан и seo.autoCanonical !== false — генерируется self-каноникал.
canonical: https://example.com/canonical-url
# Покомандное управление SEO. Каждый ключ отключает соответствующую фичу,
# если установлен в false. По умолчанию всё включено.
# Перекрывает глобальные themeConfig.seo.
seo:
  og: true              # Open Graph + Twitter Card мета-теги.
  jsonLd: true          # JSON-LD структурированные данные.
  hreflang: true        # hreflang link-теги (только если >1 локали).
  canonical: true       # canonical link-тег.
  autoCanonical: true   # авто-каноникал, если поле canonical не задано.
  rss: true             # RSS/Atom/JSON feed link-теги на главной.
  maxDescriptionLength: 160  # лимит символов для авто-экстракта description. По умолчанию: 300
# Кастомный JSON-LD. Объект YAML — deep-merge с авто-генерируемой схемой
# (вложенные объекты мержатся рекурсивно). JSON-строка — полная замена.
jsonLd:
  "@type": TechArticle
  proficiencyLevel: Beginner
# Стандартное поле VitePress для произвольных тегов в <head>.
# Тема его тоже читает: если положить сюда noindex, она не станет
# добавлять к странице JSON-LD и canonical.
head:
  - [meta, { name: robots, content: noindex }]

### Прочее ###

# Имя компонента для замены центральной области контента.
# В отличие от layout — заменяет только Content, а не весь layout.
# Если не указан — fallback на frontmatter.layout.
# Компонент должен быть глобально зарегистрирован.
contentLayout: MyCustomContent
---
```

## Обычные страницы (`layout: page`)

`layout: page` — это простая страница без «обвязки» поста: тема выводит только
ваш markdown-контент, левый сайдбар и подвал. Заголовок первого уровня пишете
сами в тексте страницы — `title` из frontmatter в тело страницы не выводится, он
идёт только в `<title>` браузера и в SEO-теги.

Типичная страница выглядит так:

```yaml
---
# Обязательное поле — без него страница отрендерится как пост
# Доступные варианты: post, home, page, util, tag, category, archive, author.
# Кроме них: false — голый контент без сайдбара, шапки и подвала;
# имя глобально зарегистрированного компонента — полная замена layout'а.
layout: page
# Идёт в <title> и в SEO-мета. В теле страницы не выводится —
# заголовок пишите в markdown сами
title: О блоге
# Идёт в meta description
description: Кто я, о чём этот блог и как со мной связаться.
# Карта переводов: код локали → относительный путь
translations:
  en: /en/about
---
```

Кроме этих четырёх на `layout: page` работают ещё:

- `aside` — правая колонка. На страницах по умолчанию **выключена**
  (`page` нет в `themeConfig.asideLayouts`), включается через `aside: true`.
- `toc` — оглавление. По умолчанию выключено; на страницах оглавление живёт
  только в правой колонке, поэтому одного `toc: true` мало — нужен ещё
  `aside: true`.
- `ads` — рекламные слоты, включая in-content. По умолчанию выключены.
- `draft` — черновик: URL работает для превью, но страница исключается из
  sitemap, поиска и помечается `noindex`.
- `searchIncluded` — участие в индексе Pagefind. По умолчанию `true`.
- `canonical`, `seo`, `head` — канонический URL, покомандное отключение
  SEO-фич и произвольные теги в `<head>`.
- `jsonLd` — свой JSON-LD, объектом (deep-merge) или строкой (полная замена).
- `editLink` — `false` убирает ссылку «редактировать страницу».
- `contentLayout` — подмена центральной области своим компонентом.

Все остальные поля из примера поста на `layout: page` **игнорируются**: `date`,
`authorId`, `cover` и прочие `cover*`, `category`, `categories`, `tags`,
`featured`, `previewText`, `descriptionAsPreview`, `readingTime`, `videoLink`,
`videoLinkLang`, `podcasts`, `podcastLang`, `commentLink`. Обычные страницы не
попадают в ленты и списки постов, поэтому ни таксономии, ни превью, ни обложка
им не нужны.

## Главная страница (`layout: home`)

**Главная не настраивается через frontmatter.** Весь её вид — hero-блок, секции,
ширина, тема оформления и фон — описывается в конфиге, а `src/<локаль>/index.md`
содержит только layout:

```yaml
---
layout: home
---
```

Оформление задаётся в `site.yaml`, локализуемые тексты — в `_site.yaml` локали
(подробно — в статье [Домашняя страница](home-page)). Слои конфига мержатся
глубоко, поэтому даже «одной локали нужен свой фон» решается конфигом, без
frontmatter:

```yaml
# ru/_site.yaml — перекрывает только image, остальное берётся из site.yaml
themeConfig:
  home:
    background:
      image: /img/home-ru.webp
```

Из общих полей frontmatter на главной имеют смысл только `title`,
`description`, `translations`, `canonical`, `seo` и `draft`. Поля `aside`,
`toc`, `ads` и `readingTime` игнорируются всегда, даже если указать их явно:
главная использует собственный полноэкранный layout без боковых колонок.

## Дальше по темам

Каждое поле разбирается отдельно в тематических постах раздела «Контент»:
[обложки и медиа](covers-images-media),
[авторы](authors),
[карточки постов](lists-and-pages#карточки-постов-в-списках) и [настройки themeConfig](themeconfig-settings).
Поля `draft` и `readingTime` разбираются в
[Черновиках, времени чтения, видео и подкастах](drafts-video-podcasts).
