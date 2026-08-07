---
title: Публикация и деплой
description: >
  Как собрать статический сайт и выложить его на любой статический хостинг —
  на примере GitHub Pages
authorId: ivan-k
date: 2026-07-30
category: getting-started
tags: [start, deploy]
descriptionAsPreview: true
---

Блог собирается в набор статических файлов — их можно выложить куда угодно: GitHub
Pages, Netlify, Vercel, Cloudflare Pages или обычный веб-сервер. Разберём процесс
на примере GitHub Pages: именно так опубликован [этот сайт](https://bozonx.github.io/vitepress-theme-neptu/blog).

## Сборка

```bash
npm run build      # или: pnpm build / yarn build
```

Команда собирает сайт в `src/.vitepress/dist` и заодно строит поисковый индекс
Pagefind — тема делает это сама, отдельный шаг сборки не нужен.
Посмотреть результат локально:

```bash
npm run preview    # или: pnpm preview / yarn preview
```

Содержимое `src/.vitepress/dist` — это и есть готовый сайт. Загрузите эту папку на ваш
хостинг, и всё будет работать.

## Два адреса: `siteUrl` и `base`

Их легко перепутать, но это разные вещи:

- **`siteUrl`** — абсолютный адрес сайта (`https://myblog.org`). Нужен для canonical,
  sitemap, RSS, Open Graph. Задаётся в `.vitepress/config.ts`. 
- **`base`** — путь, по которому сайт лежит на домене. Для корня домена это `/`.
  Для GitHub Pages, например это `/<имя-репозитория>/`. Так же вы можете размещать сайт по любому пути, даже вложеному `/path/to/site/`. Слэш на конце обязателен.

Тоесть если сайт публикуется в корне (`myblog.org`) то `base` задавать не нужно. Он задается только при размещении сайта не в корне.

::: info
Если сайт находится не в корне (используется, например `base: /path-to-site/`), то путь `base` **автоматически добавляется** к `siteUrl` для всех SEO-ссылок (canonical, sitemap, RSS, Open Graph, JSON-LD). Дублировать путь в `siteUrl` вручную не нужно — достаточно указать домен: `https://myblog.org`.
:::

## GitHub Pages (проектная страница)

Проектная страница живёт по адресу `https://<user>.github.io/<repo>/`, то есть в
подпапке. Значит нужен `base: '/<repo>/'`. Передайте его при сборке:

```json
// package.json
{
  "scripts": {
    "build": "vitepress build src --base /my-blog/"
  }
}
```

И укажите абсолютный адрес в конфиге:

```ts
// .vitepress/config.ts
siteUrl: 'https://<user>.github.io'
```

Путь `/my-blog/` добавится автоматически из `base`.

## Автоматический деплой через GitHub Actions

Этот workflow собирает сайт при каждом пуше в `main` и публикует его на Pages:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    permissions:
      contents: read
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      # npm run build подхватит --base из скрипта в package.json
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: src/.vitepress/dist
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

В настройках репозитория включите **Settings → Pages → Source: GitHub Actions**.

Если вы используете [аналитику и популярные посты](analytics), добавьте секреты
`GA_PROPERTY_ID` и `GA_CREDENTIALS_JSON` в **Settings → Secrets and variables →
Actions** и пробросьте их в шаг `npm run build` через `env:`.

## Другие хостинги

На Netlify, Vercel или Cloudflare Pages укажите те же параметры:

| Параметр | Значение |
| --- | --- |
| Команда сборки | `npm run build` |
| Каталог публикации | `src/.vitepress/dist` |
| Версия Node.js | 22.18+ |

На этих платформах сайт обычно лежит в корне домена, поэтому `base` менять не нужно —
достаточно задать правильный `siteUrl`.

## Деплой с помощью ИИ-агента

Если вы не хотите настраивать деплой вручную, попросите ИИ-агента (например,
Codex, Claude Code, Cascade и тд) сделать это за вас. Агент может
создать конфигурацию, написать workflow и проверить сборку.

Выполняйте запрос в корне вашего блога.

### Как устроен хороший запрос

Агент не угадывает — он делает то, что написано. Полезный запрос состоит из
четырёх частей:

1. **Что за проект** — блог на VitePress с темой `vitepress-theme-neptu`,
   исходники в `src/`, сборка в `src/.vitepress/dist`, Node.js 22.18+.
2. **Куда деплоим** — платформа и адрес сайта.
3. **Что конкретно сделать** — какие файлы создать или изменить.
4. **Как проверить** — чем закончить работу (обычно `npm run build`).

Ниже — готовые запросы. Замените значения в угловых скобках `<...>` на свои,
остальное можно оставить как есть.

**Netlify:**

> Настрой деплой моего блога на Netlify. Это VitePress-сайт на теме
> `vitepress-theme-neptu`: исходники в `src/`, сборка командой `npm run build`,
> результат в `src/.vitepress/dist`, нужен Node.js 22.18+.
>
> Сделай:
>
> 1. Создай `netlify.toml`: команда сборки, каталог публикации и
>    `NODE_VERSION = "22"` в переменных окружения.
> 2. Пропиши `siteUrl: 'https://<мой-домен>'` в `src/.vitepress/config.ts`.
>    Сайт лежит в корне домена, поэтому `base` менять не нужно.
> 3. Запусти `npm run build` и убедись, что сборка проходит без ошибок.
>
> Ничего не коммить и не пушить — я проверю изменения сам.

**Vercel:**

> Настрой деплой моего блога на Vercel. Это VitePress-сайт на теме
> `vitepress-theme-neptu`: исходники в `src/`, сборка командой `npm run build`,
> результат в `src/.vitepress/dist`, нужен Node.js 22.18+.
>
> Сделай:
>
> 1. Создай `vercel.json` для статического сайта: `buildCommand`,
>    `outputDirectory` и `framework: null` (автоопределение фреймворка сюда
>    не подходит — каталог сборки нестандартный).
> 2. Добавь в `package.json` поле `"engines": { "node": "22.x" }`, чтобы Vercel
>    взял нужную версию Node.
> 3. Пропиши `siteUrl: 'https://<мой-домен>'` в `src/.vitepress/config.ts`.
> 4. Запусти `npm run build` и убедись, что сборка проходит без ошибок.
>
> Ничего не коммить и не пушить — я проверю изменения сам.

**Cloudflare Pages:**

> Подготовь мой блог к деплою на Cloudflare Pages. Это VitePress-сайт на теме
> `vitepress-theme-neptu`: исходники в `src/`, сборка командой `npm run build`,
> результат в `src/.vitepress/dist`, нужен Node.js 22.18+.
>
> Сделай:
>
> 1. Создай в корне файл `.node-version` со значением `22` — Cloudflare читает
>    его при сборке.
> 2. Пропиши `siteUrl: 'https://<мой-домен>'` в `src/.vitepress/config.ts`.
> 3. Запусти `npm run build` и убедись, что сборка проходит без ошибок.
> 4. Выпиши списком, что мне ввести в Cloudflare Dashboard при создании проекта
>    (build command, output directory, переменные окружения) — я подключу
>    репозиторий сам.
>
> Ничего не коммить и не пушить — я проверю изменения сам.

**GitHub Pages (проектная страница + автодеплой):**

> Настрой автоматический деплой моего блога на GitHub Pages. Это VitePress-сайт
> на теме `vitepress-theme-neptu`: исходники в `src/`, сборка командой
> `npm run build`, результат в `src/.vitepress/dist`, нужен Node.js 22.18+.
> Репозиторий — `<user>/<repo>`, сайт будет по адресу
> `https://<user>.github.io/<repo>/`.
>
> Сделай:
>
> 1. Сайт лежит в подпапке, поэтому в скрипт `build` в `package.json` добавь
>    `--base /<repo>/` (слэши с обеих сторон обязательны). Тот же `--base`
>    добавь в скрипт `preview`, чтобы локальный просмотр совпадал с продом.
> 2. Пропиши `siteUrl: 'https://<user>.github.io'` в `src/.vitepress/config.ts`
>    — без пути репозитория, он добавится автоматически из `base`.
> 3. Создай `.github/workflows/deploy.yml`: сборка при пуше в `main`,
>    `actions/upload-pages-artifact` с путём `src/.vitepress/dist` и
>    `actions/deploy-pages`. Добавь `concurrency` с группой `pages`.
> 4. Запусти `npm run build` и проверь, что в собранном `index.html` пути
>    к ассетам начинаются с `/<repo>/`.
> 5. Напомни, что нужно включить в настройках репозитория.
>
> Ничего не коммить и не пушить — я проверю изменения сам.

### Что агент сделает хорошо, а что нет

Агент справится с рутиной внутри репозитория:

- сгенерирует файл конфигурации платформы (`netlify.toml`, `vercel.json`, `.node-version`);
- создаст или обновит GitHub Actions workflow;
- поправит `base` и `siteUrl` и объяснит, как они связаны;
- пробросит переменные окружения в шаг сборки;
- запустит `npm run build` и разберётся с ошибками сборки.

А вот это придётся сделать вам — у агента нет доступа к вашим аккаунтам:

- подключить репозиторий к Netlify / Vercel / Cloudflare;
- включить **Settings → Pages → Source: GitHub Actions**;
- добавить секреты в настройки репозитория или платформы;
- привязать домен и дождаться выпуска сертификата.

### Советы

- Дайте агенту ссылку на эту статью — он увидит актуальные параметры сборки.
- Просите проверять результат командой `npm run build`, а не «на глаз»: почти
  все ошибки в `base` и `siteUrl` всплывают именно на сборке.
- Не диктуйте содержимое файлов построчно — достаточно назвать нужные значения.
  Так конфиг останется читаемым, и его будет легко поправить руками.
- Секреты (`GA_CREDENTIALS_JSON`, токены платформ) добавляйте сами через
  интерфейс — в запросе к агенту их писать не нужно.
- Если что-то пошло не так, покажите агенту лог сборки целиком — по нему он
  чинит проблему быстрее, чем по описанию «сайт не открывается».

---

Далее [Возможности Markdown](./markdown-syntax.md)
