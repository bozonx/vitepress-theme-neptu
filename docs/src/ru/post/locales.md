---
title: Локали и мультиязычность
description: Модель локалей темы — маршрутизация, встроенные переводы, переключение языка и сопоставление переведённых страниц.
authorId: ivan-k
date: 2026-07-14
category: { name: 'Мультиязычность', slug: 'i18n' }
tags: [i18n, config]
descrAsPreview: true
---

Тема изначально спроектирована мультиязычной. Поддерживаются как короткие, так и
дефисные локали: `en`, `ru`, `en-US`, `en-GB`, `pt-BR`, `zh-CN`.

## Термины

### Локаль

В теме единое понятие локали, управляющее и контентом, и интерфейсом.
Оно определяется URL и папкой контента:

```text
src/
  en/
  ru/
  en-US/
```

Тема всегда использует маршрутизацию с префиксом локали. Даже одноязычный сайт
хранит контент в папке локали, например `src/en/`.

Это жёсткий контракт Neptu, а не требование создавать переводы. Одноязычный
сайт содержит одну папку локали и является полностью корректным. Плоская
структура с постами и страницами непосредственно в `src/` не поддерживается:
она создала бы второй набор правил для URL, RSS, sitemap, canonical и JSON-LD.
`defineBlogConfig` проверяет этот контракт при сборке: ключ `locales.root` или
корневой Markdown-файл кроме `src/index.md` завершают сборку с подсказкой о
переносе файла в папку локали.

Когда пользователь находится на `/ru/post/hello`, дерево контента, метаданные языка
страницы, альтернативные ссылки и все строки интерфейса берутся из локали `ru`.

Отдельного «UI-локаль» в `localStorage` или переключателя в верхней панели нет.

## Основные правила

### 1. Локаль определяется из URL

Текущая локаль извлекается из маршрута.

Примеры:

- `/en/post/hello` → локаль `en`
- `/en-GB/post/hello` → локаль `en-GB`
- `/ru/page/about` → локаль `ru`

URL — источник истины.

### 2. Префикс локали всегда включён

Тема не поддерживает отключение мультиязычной маршрутизации. Внутренние ссылки
всегда разрешаются относительно текущей локали.

## Поведение при первом посещении

Корневой адрес `/` открывает нейтральную страницу выбора языка с обычными
HTML-ссылками на все доступные локали. Ссылки присутствуют уже в собранном HTML,
поэтому работают без JavaScript и доступны поисковым роботам.

На странице нет текстов, которые пришлось бы переводить: единственная надпись —
заголовок сайта (в корне он берётся из основной локали, см. `mergeBlogConfig`),
а каждый язык подписан своим самоназванием. Страница остаётся индексируемой,
потому что именно на неё указывает `hreflang="x-default"`.

В браузере тема может определить наиболее подходящую локаль:

1. Точное совпадение языка браузера с поддерживаемыми локалями.
2. Совпадение базового языка (часть до `-`).

Подходящая ссылка выделяется только визуально и прокручивается в зону видимости —
без словесной пометки вроде «Рекомендуется», которую пришлось бы переводить и
которая читается как навязывание. Сайт не переходит по ней автоматически:
пользователь всегда сам выбирает язык. Это также предотвращает нежелательные
переходы для многоязычных пользователей и поисковых роботов.

Не добавляйте таймер или отложенный JavaScript-редирект. Для одноязычного сайта,
если нужен мгновенный переход с `/` на единственную локаль, настройте постоянный
HTTP-редирект `301` или `308` на хостинге. Это правило развёртывания, а не второй
режим структуры исходников.

## Встроенные переводы

Тема поставляет встроенные переводы для локалей в
`src/configs/blogLocalesBase/<locale>.ts` (включая `en`, `ru`, `es`, `zh`, `sr`, `pt`,
`fr`, `de`, `tr`, `ja`, `ko`, `it`, `pl`, `lv`, `nl`, `sv`, `cs`, `hi`, `th`, `he`, `ar`).
Каждый файл — `LocaleDefinition` с `themeConfig` (UI-подписи: `langMenuLabel`,
`sidebarMenuLabel`) и `t` (строки переводов).

Правило разрешения для встроенного слоя:

1. Точное совпадение ключа с текущей локалью (например `en-GB`, `es-419`, `zh-CN`).
2. Совпадение базового языка — часть до `-` (например `en` для `en-GB`).
3. Специальный региональный fallback (например `es-*` → `es-419`, `zh-*` → `zh-CN`).
4. Встроенный английский fallback `en`.

## Строки переводов от администратора

Администраторы переопределяют строки переводов через `themeConfig.t` на любом
уровне: `config.ts`, `site.yaml` (кросс-локальный) или `_site.yaml` (для одной
локали). Deep-merge: указываются только нужные ключи, остальные наследуются из
встроенного слоя.

```yaml
# src/ru/_site.yaml
themeConfig:
  langMenuLabel: 'Сменить язык'
  t:
    search: 'Поиск по блогу'
    links:
      donate: 'Поддержать'
```

### Ключи `t`

**Строковые ключи верхнего уровня:**

| Ключ | Значение по умолчанию (en) |
| --- | --- |
| `popularPosts` | Popular Posts |
| `featuredPosts` | Featured Posts |
| `similarPosts` | Similar Posts |
| `previousPost` | Previous post |
| `nextPost` | Next post |
| `shareSocialMedia` | Share on Social Media |
| `currentLang` | Current language |
| `tags` | Tags |
| `allTags` | All Tags |
| `allTagsCall` | View All Tags |
| `tagPageHeader` | All Posts by Tag |
| `tagBadgeCount` | The number of posts on this tag |
| `categories` | Categories |
| `allCategories` | All Categories |
| `allCategoriesCall` | View All Categories |
| `categoryPageHeader` | All Posts in Category |
| `categoryBadgeCount` | The number of posts in this category |
| `breadcrumbHome` | Home |
| `paginationToStart` | First Page |
| `paginationToEnd` | Last Page |
| `toHome` | Go to the home page |
| `toBlog` | Go to blog |
| `author` | Author |
| `year` | Year |
| `showMorePosts` | Load More |
| `listenPodcast` | Listen to podcast |
| `commentLink` | Discuss this post |
| `popularPostsCall` | View All Popular Posts |
| `viewInAnotherLanguage` | View in another language |
| `postVideoButton` | Watch Video |
| `allPostsOfAuthor` | Posts of the author |
| `allPostsOfYear` | All posts of the year |
| `closeMenu` | Close menu |
| `pageNotFound` | 404 not found |
| `postsCount` | Publications |
| `editLink` | Found an error? Suggest an edit |
| `draftLabel` | Draft |
| `draftTitle` | This post is a draft and is hidden from lists |
| `readingTime` | Reading time |
| `tocLabel` | On this page |
| `adLabel` | Advertisement |
| `search` | Search |
| `searchInBlog` | Search in this blog |

**Формы множественного числа** — массивы, длина которых зависит от языка:
`postsCountForms` (английский: `['Publication', 'Publications']`, русский:
`['публикация', 'публикации', 'публикаций']`) и `readingTimeForms`
(русский: `['мин', 'мин', 'мин']`). Порядок для славянских языков —
1 / 2–4 / 5–20; для языков без склонения достаточно одного элемента.

**`months`** — массив из 12 названий месяцев, с января по декабрь.

**Вложенные группы:**

| Группа | Что подписывает |
| --- | --- |
| `links` | Навигация и сайдбар: `aboutBlog`, `donate`, `recent`, `featured`, `popular`, `byDate`, `links`, `authors`, `aboutUs`, `rssFeed`, `atomFeed` |
| `podcasts` | Названия платформ подкастов: `site`, `rss`, `spotify`, `applepodcasts`, `youtube`, `castbox`, `deezer`, `overcast` и другие |
| `audioFile` | Аудиоплеер: подписи управления, состояния и ошибки |
| `videoFile` | Видеоплеер: то же для видео |
| `fileDownload` | Кнопка скачивания файла |
| `lightbox` | Лайтбокс изображений: `prev`, `next`, `close`, `resetZoom`, `dialogTitle`, `loadingIndicatorLabel` |

Значения по умолчанию для каждого языка лежат в
`src/configs/blogLocalesBase/<locale>.ts` и
`src/configs/sharedLocalesBase/<locale>.ts`. В стартовом шаблоне
[`src/site.yaml`](https://github.com/bozonx/vitepress-theme-neptu/tree/main/packages/blog/template/src/site.yaml)
все ключи перечислены закомментированными — это самый удобный справочник под рукой.

## Переключение языка

Переключатель в верхней панели переводит читателя на ту же страницу в дереве
другой локали. Как страницы связываются между собой и что из этого получают
поисковики, разбирается в [Связывании переводов и hreflang](i18n-hreflang) —
коротко: поле `translations` во frontmatter, а без него совпадение по
относительному пути.

Автоподстановку соответствующей страницы можно отключить — тогда переключатель
всегда ведёт на главную нужной локали:

```ts
// .vitepress/config.ts
themeConfig: { i18nRouting: false }
```

## Как добавить язык

Создать папку недостаточно — нужны три шага:

1. **Скопируйте папку локали.** `src/en/` → `src/ru/`. Вместе с контентом
   переносятся служебные папки списков (`recent/`, `archive/`, `tags/`,
   `categories/`, `featured/`, `authors/`, `popular/`) и файлы
   `getAllPosts.ts` и `loadPosts.data.ts` — они локале-независимы и правок не
   требуют.
2. **Задайте `lang`, `title` и `description`** в её `_site.yaml`.
3. **Зарегистрируйте данные локали** в `src/.vitepress/theme/Layout.vue`:

```vue
<script setup lang="ts">
// @ts-expect-error VitePress отдаёт сгенерированные данные именованным экспортом.
import { data as enData } from '../../en/loadPosts.data'
// @ts-expect-error
import { data as ruData } from '../../ru/loadPosts.data'

const posts = { en: enData.posts, ru: ruData.posts }
provide('posts', posts)
</script>
```

Третий шаг легко забыть, а без него сборка падает с `Could not resolve`. Причина
техническая: data-лоадеры VitePress — статические импорты, вычислить их список
во время сборки нельзя, поэтому каждая локаль добавляется строкой вручную.
Ключи объекта `posts` должны совпадать с именами папок в `src/`.

Переводы интерфейса подхватятся сами, если язык есть во встроенном наборе;
иначе задайте нужные ключи `t` (см. выше).

## Наследование локалей (`extends`)

Близкие локали не нужно настраивать дважды. `extends` в `_site.yaml` указывает
имя папки родительской локали, чьи настройки берутся за основу:

```yaml
# src/en-GB/_site.yaml
extends: en
lang: en-GB
title: My Blog
```

Значение — имя папки, а не путь к файлу. Наследуются `themeConfig` и переводы;
объекты объединяются рекурсивно, поэтому переопределять достаточно отличия.

## Форматирование

Там, где формат зависит от языка, тема опирается на `lang` страницы, а не на имя
папки локали:

- даты форматируются по разрешённому `lang` страницы;
- SEO-теги и `hreflang` используют значение `lang` локали.
