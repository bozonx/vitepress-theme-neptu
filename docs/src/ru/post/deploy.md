---
title: Публикация и деплой
description: >
  Как собрать статический сайт и выложить его на любой статический хостинг —
  на примере GitHub Pages с поддоменным путём.
date: 2024-11-20T09:00:00Z
authorId: ivan-k
tags:
  - guide
  - deploy
descrAsPreview: true
---

Блог собирается в набор статических файлов — их можно выложить куда угодно: GitHub
Pages, Netlify, Vercel, Cloudflare Pages или обычный веб-сервер. Разберём процесс
на примере GitHub Pages: именно так опубликован [этот сайт](https://bozonx.github.io/vitepress-theme-neptu-blog).

## Сборка

```bash
npm run build      # или: pnpm build / yarn build
```

Команда собирает сайт в `src/.vitepress/dist` и строит поисковый индекс Pagefind.
Посмотреть результат локально:

```bash
npm run preview    # или: pnpm preview / yarn preview
```

Содержимое `src/.vitepress/dist` — это и есть готовый сайт. Загрузите эту папку на
хостинг, и всё будет работать.

## Два адреса: `siteUrl` и `base`

Их легко перепутать, но это разные вещи:

- **`siteUrl`** — абсолютный адрес сайта (`https://myblog.org`). Нужен для canonical,
  sitemap, RSS, Open Graph. Задаётся в `.vitepress/config.ts`.
- **`base`** — путь, по которому сайт лежит на домене. Для корня домена это `/`.
  Для «проектной» страницы GitHub Pages — `/<имя-репозитория>/`.

Если сайт публикуется в корне (`myblog.org`), `base` менять не нужно. Он важен
только при размещении в подпапке.

## GitHub Pages (проектная страница)

Проектная страница живёт по адресу `https://<user>.github.io/<repo>/`, то есть в
подпапке. Значит нужен `base: '/<repo>/'`. Передайте его при сборке:

```json
// package.json
{
  "scripts": {
    "build": "vitepress build src --base /my-blog/ && pagefind --verbose --site ./src/.vitepress/dist --glob '**/*.html'"
  }
}
```

И укажите абсолютный адрес в конфиге:

```ts
// .vitepress/config.ts
siteUrl: 'https://<user>.github.io/my-blog'
```

## Автоматический деплой через GitHub Actions

Workflow собирает сайт при каждом пуше в `main` и публикует его на Pages:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: src/.vitepress/dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

В настройках репозитория включите **Settings → Pages → Source: GitHub Actions**.

Если вы используете [популярные посты через GA4](seo-feeds-search), добавьте секреты
`GA_PROPERTY_ID` и `GA_CREDENTIALS_JSON` в **Settings → Secrets and variables →
Actions** и пробросьте их в шаг `npm run build` через `env:`.

## Другие хостинги

На Netlify, Vercel или Cloudflare Pages укажите те же параметры:

| Параметр | Значение |
| --- | --- |
| Команда сборки | `npm run build` |
| Каталог публикации | `src/.vitepress/dist` |
| Версия Node.js | 18 или новее |

На этих платформах сайт обычно лежит в корне домена, поэтому `base` менять не нужно —
достаточно задать правильный `siteUrl`.
