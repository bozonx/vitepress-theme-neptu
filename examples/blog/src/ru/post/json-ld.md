---
title: Микроразметка JSON-LD
description: >
  Тема автоматически генерирует микроразметку BlogPosting JSON-LD для каждого поста. Поле
  jsonLd во frontmatter позволяет расширять или переопределять сгенерированную схему.
authorId: maria-editor
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu
translations:
  en: /en/post/json-ld
date: 2026-07-10
category: { name: 'SEO', slug: 'seo' }
tags: [seo]
descrAsPreview: true
---

Откройте инструменты разработчика на этой странице и найдите в `<head>` тег
`<script type="application/ld+json">`. Этот блок собран автоматически из frontmatter
статьи — **и** расширен полем `jsonLd`, показанным ниже.

## Что работает автоматически

Для каждого поста тема строит схему `BlogPosting` (подтип `Article`) на основе
`title`, `description`, `date`, `authorId` и `cover`. Обычно вам вообще не нужно
писать JSON-LD вручную.

Рядом со схемой поста в тот же `@graph` попадает `Organization` издателя — его
данные берутся из `themeConfig.publisher`:

```yaml
# src/site.yaml
themeConfig:
  publisher:
    name: 'Мой блог'
    url: '${config.siteUrl}'
    logo: '/img/logo.webp'   # желательно квадратный, от 112×112
```

Без `publisher` схема остаётся валидной, но поисковики не увидят, кто
публикует материал.

Теги попадают в `keywords`, а категории — в `articleSection` (массивом, а не
строкой через запятую, чтобы значения оставались раздельными).

Если у поста есть категория, рядом со схемой поста в тот же `@graph`
добавляется `BreadcrumbList` — те же четыре шага, что видит читатель в хлебных
крошках: главная → категории → категория → пост. Разметка строится из тех же
данных, что и видимые крошки: Google требует, чтобы они совпадали. Без категории
крошек нет — и `BreadcrumbList` тоже не выводится. См. [Категории и
теги](categories-and-tags).

## Расширение или замена схемы

Поле frontmatter `jsonLd` поддерживает два режима в зависимости от формата:

- **Объект YAML** То что вы указываете, будет смержено рекурсивно с JSON-LD обьектом который тема сгенерировала сама. Используется deep-merge механизм для всех полей кроме массивов, они заменяются.
- **JSON-строка** → **полная замена**. Авто-генерируемая схема отбрасывается
  целиком; вы берёте полный контроль.

Этот пост использует YAML block-скаляр, чтобы изменить тип на `TechArticle` и
добавить два поля:

### Как это сделать

```yaml
# Обратите внимание на кавычки вокруг "@type" — незакавыченная собачка @ невалидна в YAML.
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu
```

Для полной замены используйте JSON-строку:

```yaml
jsonLd: '{"@context":"https://schema.org","@type":"FAQPage","name":"FAQ"}'
```

## Вложенные объекты и массивы

```yaml
jsonLd: |
  isPartOf:
    "@type": Blog
    name: My Blog
    url: https://myblog.org
```

```yaml
jsonLd: |
  isPartOf:
    - "@type": WebSite
      name: Main Website
      url: https://myblog.org
    - "@type": Blog
      name: My Blog
      url: https://myblog.org/blog
```

## Отключение микроразметки

Для конкретной страницы во frontmatter:

```yaml
seo:
  jsonLd: false
```

Глобально, в `src/site.yaml`:

```yaml
themeConfig:
  seo:
    jsonLd: false
```

О других SEO-возможностях (OG, canonical, hreflang, RSS) и их переключателях см. в разделе
[Ленты, поиск и SEO-переключатели](seo-feeds-search).
