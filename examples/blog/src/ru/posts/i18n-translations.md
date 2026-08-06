---
title: Переводы интерфейса и страница выбора языка
description: >
  Встроенные переводы, справочник ключей t, стилизация страницы выбора языка,
  наследование локалей и форматирование по языку.
authorId: ivan-k
date: 2026-08-05
category: { name: 'Углубляемся в тему Neptu', slug: 'neptu-deep' }
tags: [i18n, config]
descriptionAsPreview: true
---

Базовая модель локалей — маршрутизация, именование и добавление языков —
разобрана в [Локалях и мультиязычности](locales). Здесь — внутреннее устройство
переводов интерфейса, страница выбора языка, наследование локалей и
форматирование.

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

### Стилизация страницы выбора языка

Страница построена из компонента `LocaleSelector` со следующей структурой классов:

| Класс | Элемент |
| --- | --- |
| `.locale-selector-wrapper` | Внешний контейнер всей страницы |
| `.locale-selector` | Основная область с фоновыми градиентами |
| `.locale-selector__panel` | Карточка с заголовком и ссылками |
| `.locale-selector__title` | Заголовок сайта (`<h1>`) |
| `.locale-selector__links` | Навигация со ссылками на локали (`<nav>`) |
| `.locale-selector__link` | Ссылка на одну локаль (`<a>`) |
| `.locale-selector__link--detected` | Модификатор: язык, определённый из браузера |
| `.locale-selector__label` | Блок с названием языка и кодом внутри ссылки |
| `.locale-selector__arrow` | Стрелка справа в ссылке |

Визуальные значения вынесены в CSS-переменные на `.locale-selector-wrapper`.
Их можно переопределить в своём CSS — без `!important` и борьбы со scoped-стилями:

```css
.locale-selector-wrapper {
  --locale-selector-bg: #f8f4ff;
  --locale-selector-panel-bg: rgba(255, 255, 255, 0.9);
  --locale-selector-panel-border: 1px solid #e8e0f0;
  --locale-selector-panel-radius: 1.5rem;
  --locale-selector-title-color: #6b21a8;
  --locale-selector-link-bg: #faf5ff;
  --locale-selector-link-border: #e9d5ff;
  --locale-selector-link-hover-bg: #f3e8ff;
  --locale-selector-link-hover-border: #a855f7;
  --locale-selector-arrow-color: #a855f7;
}
```

Полный список переменных с значениями по умолчанию — в исходнике компонента
`LocaleSelector.vue`. Тёмная тема переопределяется через `.dark
.locale-selector-wrapper { ... }`.

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

## Фолбэк локали

Фолбэк — это автоматический выбор базовой локали, когда точного совпадения нет.
Он работает **только для строк интерфейса**, но не для контента и URL.

### Что фолбэкает

Строки интерфейса (встроенные и пользовательские) разрешаются через
`resolveBaseLocaleKey` — ту же цепочку из четырёх шагов, что описана выше.
Если пользователь находится на `/en-US/posts/hello`, а папки `src/en-US/` нет,
интерфейс всё равно получит переводы локали `en` — часть до `-` совпадает.

Это касается и страницы 404: `NotFound.vue` определяет локаль из URL и
показывает тексты на базовом языке, а не на английском по умолчанию.

### Что не фолбэкает

Контент и URL — не фолбэкают. VitePress — статический генератор: страницы
генерируются только для тех папок локалей, которые реально существуют в `src/`.
Если папки `src/en-US/` нет, страница `/en-US/posts/hello` не будет собрана,
а посетитель получит 404.

Тема не выполняет клиентский редирект с несуществующей локали на базовую.
Причина — статический сайт не может надёжно отличить «локаль существует, но
страницы нет» от «локали не существует вообще». Автоматический редирект мог бы
маскировать реальные ошибки и ломать индексацию.

### Что делать

- **Используйте `extends`** — если нужна региональная локаль (`en-GB`) с
  минимальными отличиями от базовой, создайте папку и унаследуйте настройки
  (см. [Наследование локалей](#наследование-локалей-extends)). Контент
  будет доступен по своему URL, а переводы — унаследованы.
- **Настройте HTTP-редирект на хостинге** — если нужно, чтобы `/en-US/*`
  вело на `/en/*`, добавьте правило `301`/`308` в конфигурации хостинга
  (`_redirects` для Netlify, `vercel.json` для Vercel, rules для Cloudflare).
  Это правило развёртывания, а не часть темы.

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

## Что дальше

- [Локали и мультиязычность](locales) — маршрутизация, именование локалей, добавление языка.
- [Связывание переводов и hreflang](i18n-hreflang) — `translations` и теги для поисковиков.
