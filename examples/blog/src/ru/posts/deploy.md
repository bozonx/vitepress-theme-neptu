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

ВАЖНО! **Если сайт находится не в корне** (используется, например `base: /path-to-site/`), то тот же путь нужно включить и в `siteUrl` тоже — например `https://myblog.org/path-to-site`, но без слэша на конце.

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
      contents: read
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
Codex, Cascade, Claude Code и тд) сделать это за вас. Агент может
создать конфигурацию, написать workflow и проверить сборку.

Выполняйте запрос в корне вашего блога.

### Как сформулировать запрос

Опишите задачу конкретно — укажите платформу и что уже есть в проекте. Несколько
примеров:

**Cloudflare Pages:**

> Разверни мой VitePress-блог на теме vitepress-theme-neptu на Cloudflare Pages.
> Создай `wrangler.toml` или настрой проект через Cloudflare Dashboard. Команда
> сборки — `npm run build`, каталог публикации — `src/.vitepress/dist`.
> Node.js 22.18+. Укажи `siteUrl` в `.vitepress/config.ts`.

**Netlify:**

> Настрой деплой блога на теме vitepress-theme-neptu на Netlify. Создай
> `netlify.toml` с командой сборки `npm run build` и каталогом публикации
> `src/.vitepress/dist`. Node.js 22.18+. Укажи `siteUrl` в `.vitepress/config.ts`.

**Vercel:**

> Разверни блог на теме vitepress-theme-neptu на Vercel. Создай `vercel.json` с
> настройками для статического сайта: build-команда `npm run build`,
> output-директория `src/.vitepress/dist`. Node.js 22.18+. Укажи `siteUrl`
> в `.vitepress/config.ts`.

**GitHub Pages (автоматизация):**

> Создай GitHub Actions workflow для автоматического деплоя блога на теме
> vitepress-theme-neptu на GitHub Pages при пуше в `main`. Установи
> `base: '/<repo>/'` — передай через `--base` в скрипте `build` в `package.json`.
> Сборка через `npm run build`, артефакт из `src/.vitepress/dist`.
> Укажи `siteUrl: 'https://<user>.github.io/<repo>'` в `.vitepress/config.ts`.

### Что агент может сделать

- Сгенерировать файл конфигурации платформы (`wrangler.toml`, `netlify.toml`,
  `vercel.json` и т. д.)
- Создать или обновить GitHub Actions workflow
- Настроить переменные окружения и секреты
- Проверить, что `base` и `siteUrl` указаны правильно
- Запустить сборку локально и убедиться, что сайт собирается без ошибок

### Советы

- Укажите агенту ссылку на эту статью — он увидит актуальные параметры сборки
  и структуру проекта.
- Если платформа требует токен или API-ключ, агент подскажет, где его получить
  и как добавить в секреты репозитория — не вставляйте ключи прямо в код.
- После настройки попросите агента запустить `npm run build` и проверить, что
  в `src/.vitepress/dist` появились файлы сайта.
