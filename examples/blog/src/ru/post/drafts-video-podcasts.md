---
title: Черновики, время чтения, видео-кнопка и подкасты
description: >
  Как прятать неготовые посты, показывать оценку времени чтения, добавлять кнопку
  видео и выпадающий список подкастов к статье.
authorId: ivan-k
date: 2026-08-04
category: { name: 'Контент', slug: 'writing' }
tags: [frontmatter, config]
descrAsPreview: true
---

## Черновики

Добавьте `draft: true` во frontmatter поста — и он исчезнет из всех публичных
поверхностей блога, таких как:

- Все списки постов - свежие, популярные, архив, теги, авторы, похожие
- RSS / Atom / JSON
- sitemap.xml
- Поиск (Pagefind)
- JSON-LD, hreflang и canonical и других компонентов для SEO
- Чернови станет недоступен для поисковых ботов, ему будет добавлено `<meta name="robots" content="noindex, nofollow">` в `<head>`


```yaml
---
title: Пост, который ещё не готов
date: 2026-08-01T10:00:00Z
authorId: ivan-k
draft: true
---
```

> Страница-черновик всё равно попадает в продакшен билд и бует доступна по прямой ссылке - это будет единственный способ ее открыть, например для того чтобы поделиться ссылкой с коллегами, для обсуждения статьи перед публикацией.
> Если вам нужно, чтобы файл вообще не попадал в сборку, исключите его средствами VitePress через `srcExclude`:
>  ```ts
>  // .vitepress/config.ts
>  export default async () => defineBlogConfig({
>    srcExclude: ['**/*.draft.md'],
>  })
>  ```

### В dev-сервере черновики видны

По умолчанию черновики **видны** в `vitepress dev` и **скрыты** в
`vitepress build`. Так автор видит неготовые посты в общем списке, пока пишет,
и при этом физически не может выложить их случайно.

Порог определяется по `NODE_ENV`. Переопределить можно явно:

```yaml
# src/site.yaml
themeConfig:
  drafts:
    showDrafts: false  # прятать даже в dev
```

`showDrafts: true` вернёт черновики во все списки и ленты — включая
продакшен-сборку. Используйте это только для внутренних превью-стендов.

## Время чтения поста

Обе величины считаются на этапе сборки по исходному markdown. Код в блоках,
инлайновый код и сырой HTML из подсчёта исключаются — длинный листинг конфига
пролистывают, а не читают.

Для CJK-письменностей слова не разделяются пробелами, поэтому символы
считаются поштучно и приводятся к «словам» по коэффициенту 2.

Оценка никогда не бывает нулевой: любой непустой текст — минимум «1 мин».

Время чтения статьи выводится под заголовком поста и в списке постов справа под заголовом в тэге `<time datetime="PT1M">` в формате ISO 8601. А количество слов выводитсья в JSON-LD поста, например так:

```json
{
  "@type": "BlogPosting",
  "wordCount": 218,
  "timeRequired": "PT1M"
}
```

### Настройка

```yaml
# src/site.yaml
themeConfig:
  readingTime:
    enabled: true      # по умолчанию true
    wpm: 200           # слов в минуту
    layouts: ['post']  # где показывать бейдж
```

Отдельная страница может переопределить список макетов:

```yaml
---
title: Длинная служебная страница
layout: page
readingTime: true
---
```

### В списке постов

По умолчанию в карточках списка время чтения не выводится — включается
отдельно:

```yaml
themeConfig:
  postList:
    showReadingTime: true
```

## Кнопка видео

`videoLink` добавляет заметную кнопку в верхней части поста. Это альтеративный способ показать, что к статье прилагается видео, например для постов которые являются пересказами содержания видео.

```yaml
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: RU     # язык метки, отображаемой на кнопке
```

## Выпадающий список подкастов

`podcasts` отображает выпадающий список ссылок на подкаст платформы. Отлично подходит для создания страницы выпуска подкаста с размещением текста подкаста в посте.

```yaml
podcastLang: RU
podcasts:
  spotify: https://open.spotify.com/…
  applepodcasts: https://podcasts.apple.com/…
  youtube: https://www.youtube.com/…
  amazonmusic: https://music.amazon.com/…
  iheartradio: https://www.iheart.com/…
  tunein: https://tunein.com/…
  castbox: https://castbox.fm/…
  soundstream: https://soundstream.com/…
  vk: https://vk.com/…
  yandexmusic: https://music.yandex.ru/…
  deezer: https://www.deezer.com/…
  pocketcasts: https://pca.st/…
  overcast: https://overcast.fm/…
  zvuk: https://zvuk.com/…
  podcastaddiction: https://podcastaddict.com/…
  # RSS-лента подкаста
  rss: https://example.com/podcast/rss
  # Сайт с текстом подкаста либо платформа которой нет в нашем списке.
  site: https://example.com/episode-1
```

## Ссылка на обсуждение

`commentLink` добавляет кнопку «Обсуждение» в футер статьи со ссылкой на платформу, где
вы ведете обсуждения (GitHub Discussions, Telegram, ветка форума…).

```yaml
commentLink: https://github.com/…/discussions
```

> Рекомендуется здесь размещать ссылку на пост в социальных сетях где опубликован пост связанный с данным постом для того чтообы направлять пользователь на ваши соц сети, на которые он могут подписаться.
