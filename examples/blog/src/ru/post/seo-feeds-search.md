---
title: Ленты, поиск и SEO-переключатели
description: Механизмы всего сайта — ленты RSS/Atom/JSON, поиск Pagefind, популярные посты через GA4, robots.txt, sitemap и глобальные переключатели SEO.
authorId: ivan-k
date: 2026-07-11
category: { name: 'SEO', slug: 'seo' }
tags: [seo, config]
descrAsPreview: true
---

Помимо отдельных постов, тема настраивает механизмы уровня всего сайта. Здесь —
ленты, поиск, популярные посты, robots и sitemap. Общая карта SEO — в
[обзоре](seo-overview); микроразметка и canonical вынесены в отдельные посты.

## Ленты (RSS / Atom / JSON)

Включены по умолчанию. Ссылки выводятся в сайдбаре (RSS + Atom) и в `<head>`
каждой страницы. Настраиваются в `src/site.yaml`:

```yaml
themeConfig:
  feeds:
    maxPosts: 50
    formats: ['rss', 'atom', 'json']
    fullContent: false
```

Пути к файлам для каждой локали: `/ru/feed.rss`, `/ru/feed.atom`, `/ru/feed.json`.

По умолчанию каждый элемент содержит описание или автоматически созданное
превью. `fullContent: true` дополнительно включает безопасный HTML всей статьи.
Относительные ссылки и изображения становятся абсолютными. Feed renderer не
исполняет пользовательские Vue-компоненты и опциональные Markdown-плагины; если
на них построена основная часть статьи, лучше оставить режим превью.

## Поиск (Pagefind)

Поиск работает на [Pagefind](https://pagefind.app): он индексирует уже собранный
сайт. **Pagefind входит в состав темы** — ставить его отдельно, добавлять шаг
сборки или подключать скрипты в `head` не нужно. Поиск включён по умолчанию;
чтобы отключить и индексацию, и кнопку поиска, поставьте `enabled: false`:

```ts
// .vitepress/config.ts
themeConfig: {
  search: { enabled: true },
},
```

Что тема делает за вас:

- **Индексация.** По окончании `vitepress build` (хук `buildEnd`) тема сама
  строит индекс и кладёт его в `<outDir>/pagefind`. Build-скрипт остаётся
  обычным: `vitepress build src`.
- **Загрузка UI.** `pagefind-ui.css` и `pagefind-ui.js` подгружаются модалкой
  поиска при первом открытии. Это экономит ~135 КБ на каждой загрузке страницы
  и избавляет dev-режим от 404 на ещё не существующие файлы индекса.

Индекс строится только из production-сборки, поэтому поиск работает после
`npm run build` + `npm run preview`, а не в dev — при открытии поиска в dev
будет понятное предупреждение в консоли.

Индексируется только текст статьи: блоки автора, комментариев, шаринга, похожих
постов и ссылки «Популярное» помечены `data-pagefind-ignore` и не попадают в
сниппеты. Теги и категория поста доступны как фильтры `tag` и `category`, а
дата — как сортировка `date`.
Исключить пост из индекса можно через `searchIncluded: false` — см.
[Превью и поиск](preview-and-search).

### Настройка индексации

Тема настраивает Pagefind с разумными значениями по умолчанию — для типичного
блога ничего настраивать не нужно. Переводы модалки (метки, подсказки клавиш)
локализуются через стандартный ключ `t.searchUI` в `site.yaml` или
`_site.yaml`. Полный справочник — в [документации Pagefind UI](https://pagefind.app/docs/ui/).

Нужны флаги, которых тема не предоставляет? Поставьте `search.enabled: false`
и вызывайте [Pagefind CLI](https://pagefind.app/docs/config-options/) сами
после сборки.

## Популярные посты (Google Analytics 4)

Секция сайдбара «Популярное» и список [`popular/1`](../popular/1) заполняются на
основе реальных просмотров из GA4 — **на этапе сборки**. Статистика запрашивается
один раз и «запекается» в статические страницы: никаких клиентских запросов к
Google API, приватный ключ используется только на сервере сборки.

Интеграция **выключена по умолчанию** — без ключа GA4 считать нечего.
Включается в коде, а учётные данные передаются через переменные окружения:

```ts
// .vitepress/config.ts
export const popularPosts = {
  enabled: true,
  sortBy: 'pageviews', // 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage'
  dataSource: {
    provider: 'ga4',
    propertyId: process.env.GA_PROPERTY_ID,
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
    // dataPeriodDays: 30,  // глубина выборки в днях
    // dataLimit: 1000,     // сколько строк запрашивать у GA
  },
}
```

Значение используется дважды: его импортирует data-лоадер локали и он же
попадает в `themeConfig.popularPosts`. Не забудьте включить сами блоки:
`sidebar.popular: true` в `site.yaml` и, если нужно, секцию `popular` на главной.

### Настройка доступа к GA4

1. Создайте **Service Account** в [Google Cloud Console](https://console.cloud.google.com/) и скачайте JSON-ключ.
2. Скопируйте `client_email` из ключа и добавьте его в **Google Analytics 4** как пользователя с ролью **Viewer**.
3. Передайте данные через переменные окружения (никогда не коммитьте ключ в репозиторий):

```bash
GA_PROPERTY_ID=123456789
GA_CREDENTIALS_JSON='{"type": "service_account", ...}'
```

Система устойчива к сбоям: если данных нет, сеть недоступна или ключ неверен,
тема выводит предупреждение и **сборка продолжается** — список популярных
просто остаётся пустым. Чтобы убрать сами блоки, выключите их в `site.yaml`
(`sidebar.popular`, секция `popular`) или верните `enabled: false`.
Как передать секреты в CI — в статье [Публикация и деплой](deploy).

## robots.txt

Если в `public/` нет своего `robots.txt`, тема генерирует его при сборке:

```text
User-agent: *
Allow: /

Sitemap: https://<siteUrl>/sitemap.xml
```

URL sitemap берётся из `siteUrl`. Свой файл положите в `public/robots.txt` — тема
его не тронет (но предупредит, если в нём нет директивы `Sitemap:`).

## sitemap.xml

Собирается автоматически из `siteUrl`. Страницы с `robots: noindex` (заданным через
`head`) исключаются и из sitemap. Служебные списки (`recent/`, `popular/`,
`archive/`, `tags/`, `authors/`) в карту сайта не попадают.

Посты и страницы без перевода включаются наравне с остальными — переведённая
версия не требуется. Вложенные посты (`post/my-article/index.md`) попадают в
sitemap по своему папочному адресу.

## SEO-переключатели

Все SEO-функции включены по умолчанию. Выключаются глобально в `src/site.yaml` или
для отдельной страницы во frontmatter через ключ `seo`:

```yaml
# Глобально — src/site.yaml
themeConfig:
  seo:
    og: true
    jsonLd: true
    hreflang: true
    canonical: true
    autoCanonical: true       # авто-canonical по умолчанию
    rss: true
    maxDescriptionLength: 300
  twitterSite: '@your_handle' # twitter:site на каждой странице
```

```yaml
# Для одной страницы — во frontmatter (переопределяет глобальное)
seo:
  jsonLd: false
  og: false
```

## Кнопки «поделиться»

Блок `social-share` в подвале поста выводит кнопки шерингa соцсетей. Каждая
локаль приносит свой готовый набор — для русской это Telegram, WhatsApp, VK, X,
Facebook и LinkedIn. Они работают без настройки.

Список из `site.yaml` и `_site.yaml` **объединяется со встроенным по ключу
`name`**, а не заменяет его. Из этого следуют три приёма:

```yaml
# src/site.yaml
themeConfig:
  socialMediaShares:
    # 1. Поменять оформление встроенной кнопки — совпало имя, поля перекрылись
    - name: telegram
      icon: 'logos:telegram'
      title: 'Телеграм'

    # 2. Добавить свою сеть — новое имя дописывается в конец
    - name: bluesky
      icon: 'simple-icons:bluesky'
      title: 'Bluesky'
      urlTemplate: 'https://bsky.app/intent/compose?text={title}%20{url}'

    # 3. Убрать встроенную кнопку
    - name: vk
      enabled: false
```

Поля записи:

| Поле | Описание |
| --- | --- |
| `name` | Ключ объединения — по нему запись находит встроенную |
| `icon` | Имя иконки [Iconify](https://icones.es), например `logos:telegram` |
| `title` | Подпись и tooltip |
| `urlTemplate` | Ссылка шеринга с плейсхолдерами `{url}` и `{title}` |
| `class` | Необязательные CSS-классы кнопки |
| `enabled` | `false` скрывает кнопку, не удаляя её из конфигурации |

`{url}` и `{title}` подставляются из текущей страницы. UTM-метки пишутся прямо в
шаблон:

```yaml
urlTemplate: 'https://x.com/intent/tweet?text={title}&url={url}%3Futm_source%3Dshare'
```

::: warning Пустой массив не скрывает блок
`socialMediaShares: []` не выключает шеринг: пустой список означает «нечего
объединять», и остаётся встроенный набор. Чтобы убрать блок, уберите
`social-share` из `postFooter` — либо пометьте каждую кнопку `enabled: false`.
:::

Порядок блоков подвала поста (включая `social-share`) задаётся массивом
`postFooter` — см. [Настройки themeConfig](themeconfig-settings#подвал-поста).

## Что вынесено в отдельные посты

Три SEO-механизма разобраны детально в своих постах — здесь только упоминаем:

- **Микроразметка JSON-LD** — [расширение схемы под свои нужды](json-ld).
- **Канонические ссылки и кросспостинг** — [указание первоисточника](canonical-crosspost).
- **Связывание переводов и hreflang** — [связь локалей между собой](i18n-hreflang).
