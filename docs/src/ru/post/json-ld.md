---
title: Микроразметка JSON-LD
description: >
  Тема автоматически генерирует микроразметку Article JSON-LD для каждого поста. Поле jsonLd
  во фронтматере позволяет расширять или переопределять сгенерированную схему.
date: 2025-01-20T14:00:00Z
authorId: maria-editor
category: { name: 'SEO', slug: 'seo' }
tags:
  - seo
  - json-ld
descrAsPreview: true
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu
translations:
  en: /en/post/json-ld
---

Откройте инструменты разработчика вашего браузера на этой странице и найдите в `<head>` тег
`<script type="application/ld+json">`. Этот блок был автоматически сгенерирован
из фронтматера статьи — **и** расширен пользовательским полем `jsonLd`,
показанным ниже.

## Что работает автоматически

Для каждого поста тема строит схему `Article` на основе `title`, `description`,
`date`, `authorId` и `cover`. Обычно вам вообще не нужно писать JSON-LD вручную.

Теги попадают в `keywords`, а категории — в `articleSection` (массивом, а не
строкой через запятую, чтобы значения оставались раздельными).

Если у поста есть категория, рядом со схемой поста в тот же `@graph`
добавляется `BreadcrumbList` — те же четыре шага, что видит читатель в хлебных
крошках: главная → категории → категория → пост. Разметка строится из тех же
данных, что и видимые крошки: Google требует, чтобы они совпадали. Без категории
крошек нет — и `BreadcrumbList` тоже не выводится. См. [Категории и
теги](categories-and-tags).

## Расширение схемы

Поле фронтматера `jsonLd` — это YAML, который **объединяется (merge)** со сгенерированной
схемой — вы указываете только то, что отличается или что тема не может определить сама. В этом
посте тип изменён на `TechArticle` и добавлены два дополнительных поля:

### Как это сделать

```yaml
# Обратите внимание на кавычки вокруг "@type" — незакавыченная собачка @ невалидна в YAML.
jsonLd: |
  "@type": TechArticle
  proficiencyLevel: Beginner
  dependencies: VitePress, vitepress-theme-neptu
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

Для конкретной страницы:

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
