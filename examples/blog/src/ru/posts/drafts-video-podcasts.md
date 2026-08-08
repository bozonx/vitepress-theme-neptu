---
title: Черновики, время чтения, видео-кнопка и подкасты
description: >
  Как прятать неготовые посты, показывать оценку времени чтения, добавлять кнопку
  видео и выпадающий список подкастов к статье.
authorId: ivan-k
date: 2026-08-04
category: writing
tags: [frontmatter, config]
descriptionAsPreview: true
videoLink: https://www.youtube.com/watch?v=dQw4w9WgXcQ
videoLinkLang: RU
podcastLang: RU
podcasts:
  - applepodcasts: https://podcasts.apple.com/
  - spotify: https://open.spotify.com/
  - youtube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  - youtubemusic: https://music.youtube.com/
  - amazonmusic: https://music.amazon.com/
  - castbox: https://castbox.fm/
  - deezer: https://www.deezer.com/
  - iheartradio: https://www.iheart.com/
  - tunein: https://tunein.com/
  - pocketcasts: https://pca.st/
  - overcast: https://overcast.fm/
  - podcastaddict: https://podcastaddict.com/
  - podcastindex: https://podcastindex.org/
  - rss: https://example.com/rss
  - site: https://example.com/episode
---

## Черновики

Добавьте `draft: true` во frontmatter поста — и он исчезнет из всех публичных
поверхностей блога, таких как:

- Все списки постов - свежие, популярные, архив, теги, авторы, похожие
- RSS / Atom / JSON
- sitemap.xml
- Поиск (Pagefind)
- JSON-LD, hreflang и canonical и других компонентов для SEO
- Черновик станет недоступен для поисковых ботов, ему будет добавлено `<meta name="robots" content="noindex, nofollow">` в `<head>`

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

## Время чтения поста и количество слов

Обе величины считаются на этапе сборки по исходному markdown. Код в блоках,
инлайновый код и сырой HTML из подсчёта исключаются — длинный листинг конфига
обычно пролистывают, а не читают.

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

Отдельная страница может явно включить показ времени чтения:

```yaml
---
title: Длинная служебная страница
layout: page
readingTime: true
---
```

### В списке постов

По умолчанию в карточках списка время чтения не выводится, но можно его включить:

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

Это **список**, а не словарь: пункты меню идут ровно в том порядке, в котором вы их записали. Указывайте только те платформы, где эпизод реально опубликован.

# Список платформ, на которых опубликован эпизод. Вверху поста будет выпадающее меню.
# Каждый пункт — `<id платформы>: <URL эпизода>`. Указывайте только те платформы,
# где эпизод реально опубликован.
# Любой другой id тоже работает: задайте его подпись и иконку один раз в
# themeConfig.podcastPlatforms — либо опишите пункт прямо здесь (последний пример).
# Незарегистрированный id не ломает ссылку: подпись будет построена из id,
# иконка — общая mdi:podcast.


```yaml
podcastLang: RU
podcasts:
  - applepodcasts: https://podcasts.apple.com/
  - spotify: https://open.spotify.com/
  - youtube: https://www.youtube.com/
  - youtubemusic: https://music.youtube.com/
  - amazonmusic: https://music.amazon.com/
  - castbox: https://castbox.fm/
  - deezer: https://www.deezer.com/
  - iheartradio: https://www.iheart.com/
  - tunein: https://tunein.com/
  - pocketcasts: https://pca.st/
  - overcast: https://overcast.fm/
  - podcastaddict: https://podcastaddict.com/
  - podcastindex: https://podcastindex.org/
  - rss: https://example.com/rss
  - site: https://example.com/episode
  # Пример кастомной платформы с кастомной иконкой
  - id: podimo
    url: https://podimo.com/
    label: Podimo
    iconUrl: /icons/podimo.svg
```

### Своя платформа

Ключ каждого пункта — id платформы. Встроенных платформ 13 (список выше);
всё остальное добавляется в реестр `themeConfig.podcastPlatforms`, откуда
берутся подпись и иконка для всех постов сразу:

```yaml
# src/site.yaml
themeConfig:
  podcastPlatforms:
    podbean:
      label: Podbean
      icon: simple-icons:podbean       # любая иконка Iconify
    zvuk:
      label: { ru: Звук, en: Zvuk }    # подпись можно задать по локалям
      iconUrl: /icons/zvuk.svg         # либо свой файл из public/
```

Тем же реестром переопределяются и встроенные платформы — достаточно указать
их id.

::: warning Иконки Iconify и оффлайн
Тема поставляется с оффлайн-набором иконок, и в нём есть только иконки
встроенных платформ. Имя из `icon`, которого там нет, будет загружаться с
`api.iconify.design` в браузере читателя: иконки не будет в SSR-выдаче, и она
не появится без сети. Если это нежелательно — используйте `iconUrl` со своим
файлом или зарегистрируйте иконку сами через `addIcon()` в своём `enhanceApp`.
:::

Для разовой платформы, ради которой не хочется трогать конфиг, пункт можно
описать прямо в посте — как в примере выше с `podimo`.

Если платформа не найдена ни в реестре, ни среди встроенных, ссылка всё равно
работает: подпись строится из id (`player-fm` → `Player Fm`), иконка — общая
`mdi:podcast`.

## Ссылка на обсуждение

`commentLink` добавляет кнопку «Обсуждение» в футер статьи со ссылкой на платформу, где
вы ведете обсуждения (GitHub Discussions, Telegram, ветка форума…).

```yaml
commentLink: https://github.com/…/discussions
```

> Рекомендуется здесь размещать ссылку на пост в социальных сетях где опубликован пост связанный с данным постом для того чтообы направлять пользователь на ваши соц сети, на которые он могут подписаться.
