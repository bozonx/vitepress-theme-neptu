---
title: Запуск блога за 5 минут
description: >
  Самый короткий путь к работающему блогу: скопировать шаблон, установить
  зависимости и запустить локальный сервер.
authorId: ivan-k
cover: https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop
coverWidth: 1200
coverHeight: 800
coverAlt: Ноутбук и чашка кофе на деревянном столе
coverDescription: "Фото [Alejandro Escamilla](https://unsplash.com/@alejandroescamilla) на Unsplash."
date: 2026-08-02
category: { name: 'Начало работы', slug: 'getting-started' }
tags: [start]
featured: true
descriptionAsPreview: true
---

Этот сайт — живое руководство по теме **Neptu**. Начнём с главного: как за
несколько минут получить работающий блог у себя на компьютере.

## Шаг 1. Скопируйте шаблон

В репозитории темы есть готовый стартовый проект — папка `template/`. Это и есть
установка: скопируйте её содержимое в новую папку своего блога.

```bash
git clone https://github.com/bozonx/vitepress-theme-neptu
cp -r vitepress-theme-neptu/packages/blog/template my-blog
cd my-blog
```

Внутри — минимальный, но полноценный блог: конфигурация, одна локаль и пара
демонстрационных постов.

## Шаг 2. Установите зависимости

```bash
npm install      # или: pnpm install / yarn install
```

Нужена минимальная версия Node.js **22.18** — этого требует VitePress 2.

## Шаг 3. Запустите локальный сервер

```bash
npm run dev      # или: pnpm dev / yarn dev
```

Откройте `http://localhost:5173` — блог уже работает.
Меняйте файлы в `src/` и обновляйте страницу: VitePress пересобирает на лету.

## Шаг 4. Соберите продакшн-версию

```bash
npm run build      # или: pnpm build / yarn build
npm run preview    # или: pnpm preview / yarn preview
```

`build` собирает статический сайт в `src/.vitepress/dist` и строит поисковый
индекс [Pagefind](https://pagefind.app/). `preview` поднимает локальный сервер на
`http://localhost:4173`, чтобы посмотреть итоговую сборку —
именно её вы позже выложите в интернет.

## Шаг 5. Деплой

Если вы хотите опубликовать блог в интернете, выполните деплой как указано на странице
[Публикация и деплой](deploy), Так же там есть примеры запросов к ИИ агентам для помощи в деплое на различные хостинги.

## Что дальше

Блог запущен — дальше в нём нужно разобраться. Следующие две страницы отвечают на
два первых вопроса:

- [Структура проекта](project-structure) — где что лежит и какой файл за что отвечает.
- [Ваш первый пост](first-post) — как добавить статью.
