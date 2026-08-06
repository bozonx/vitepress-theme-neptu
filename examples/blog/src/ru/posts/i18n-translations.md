---
title: i18n. Язык и переводы интерфейса
description: >
  Встроенные переводы, справочник ключей t, поведение корневой страницы выбора языка,
  наследование локалей, форматирование по языку, RTL и доступ к переводам из кода.
authorId: ivan-k
date: 2026-08-05
category: { name: 'Углубляемся в тему Neptu', slug: 'neptu-deep' }
tags: [i18n, config]
descriptionAsPreview: true
---

Базовая модель локалей — маршрутизация, именование и добавление языков —
разобрана в [Локалях и мультиязычности](locales). Здесь — внутреннее устройство
переводов интерфейса, страница выбора языка, фолбэк, наследование локалей,
форматирование по языку, RTL и программный доступ к переводам.

## Корневая страница сайта

На корневой странице `/` находится страница выбора языка, есть несколько особенностей касаемо нее.

- Так как эта страница выглядит как еще одна главная страница, потомчто у каждой локали есть уже главная страница, то может возникнуть желание чтото с ней сделать, например редирект с автоопределением языка пользователя. Но поисковыми провайдерами не рекомендуется делать редирект с помощью Javascript, но если ваш хостинг позволяет, можеете сделать вместо нее серверный редирект, что намного лучше
- Google рекомендует оставлять эту страницу индексируемой
- так как на нее указывает `hreflang="x-default"`, то эта страница долна быть доступна для краулинга
- Лучше всего не оставляйте ссылки на корневую страницу в соц сетях так как она не несет никакой полезной нагрузки, а сразу давайте ссылка на главную локали, например `https://example.com/ru/` или еще лучше на конкретные посты

## Встроенные переводы

Тема поставляет встроенные переводы для локалей в
`src/configs/blogLocalesBase/<locale>.ts` (включая `en`, `ru`, `es`, `zh`, `sr`, `pt`,
`fr`, `de`, `tr`, `ja`, `ko`, `it`, `pl`, `lv`, `nl`, `sv`, `cs`, `hi`, `th`, `he`, `ar`).

Правило разрешения для встроенного слоя:

1. Точное совпадение ключа с текущей локалью (например `en-GB`, `es-419`, `zh-CN`).
2. Совпадение базового языка — часть до `-` (например `en` для `en-GB`).
3. Специальный региональный fallback (например `es-*` → `es-419`, `zh-*` → `zh-CN`).
4. Встроенный английский fallback `en`.

Фолбэк — это автоматический выбор ближайшей встроенной локали, когда точного
совпадения нет. Он работает **только для строк интерфейса**, но не для контента
и URL.

### Что попадает под фолбэк

Строки интерфейса (встроенные и пользовательские) разрешаются через
`resolveBaseLocaleKey` — ту же цепочку из четырёх шагов, что описана выше.
Если пользователь находится на `/en-US/posts/hello`, а папки `src/en-US/` нет,
интерфейс всё равно получит переводы локали `en` — часть до `-` совпадает.

Это касается и страницы 404: `NotFound.vue` определяет локаль из URL и
показывает тексты на ближайшем языке, а не на английском по умолчанию.

### Что не попадает под фолбэк

Контент и URL — не фолбэкают. VitePress — статический генератор: страницы
генерируются только для тех папок локалей, которые реально существуют в `src/`.
Если папки `src/en-US/` нет, страница `/en-US/posts/hello` не будет собрана,
а посетитель получит 404.

Тема не выполняет клиентский редирект с несуществующей локали на ближайшую.
Причина — статический сайт не может надёжно отличить «локаль существует, но
страницы нет» от «локали не существует вообще». Автоматический редирект мог бы
маскировать реальные ошибки и ломать индексацию.

## Как переопределять некоторые строки перевода

Чтобы поменять какието строки в пользовательском интерфейсе отредактируйте конфиг 3 уровня `_site.yaml` в папке локали подобным образом.

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

### Переводы модального окна поиска (`t.searchUI`)

Переводы модального окна поиска Pagefind вынесены в подобъект `t.searchUI` —
`noResultsText`, `resetButtonTitle`, `displayDetails`, `backButtonTitle` и
`footer.*` (подсказки клавиатуры). Они локализуются тем же способом, что и
остальные ключи `t`:

```yaml
# src/<locale>/_site.yaml
themeConfig:
  t:
    searchUI:
      noResultsText: 'Ничего не найдено'
      resetButtonTitle: 'Сбросить'
```

### Лейблы доступности и страница 404

Помимо `t`, `themeConfig` содержит отдельные поля для accessibility-лейблов
UI-контролов и текстов системных страниц. Они не входят в объект переводов,
но локализуются per-locale через `_site.yaml`:

| Поле | Назначение |
| --- | --- |
| `sidebarMenuLabel` | tooltip кнопки открытия сайдбара на мобильных |
| `langMenuLabel` | aria-label и tooltip переключателя языка |
| `colorThemeMenuLabel` | aria-label и tooltip переключателя цветовой темы |
| `stylePresetMenuLabel` | aria-label и tooltip переключателя стилевого пресета |
| `returnToTopLabel` | текст кнопки «Наверх» |
| `lightModeSwitchTitle` | tooltip переключателя на светлую тему |
| `darkModeSwitchTitle` | tooltip переключателя на тёмную тему |
| `notFound.title` | заголовок страницы 404 |
| `notFound.linkText` | текст ссылки «на главную» на странице 404 |

```yaml
# src/<locale>/_site.yaml
themeConfig:
  sidebarMenuLabel: 'Меню'
  langMenuLabel: 'Сменить язык'
  returnToTopLabel: 'Наверх'
  lightModeSwitchTitle: 'Светлая тема'
  darkModeSwitchTitle: 'Тёмная тема'
  notFound:
    title: 'Страница не найдена'
    linkText: 'На главную'
```

Встроенные локали уже содержат переводы этих полей — переопределяйте только
при необходимости.

## Наследование локалей (`extends`)

Близкие локали не нужно настраивать дважды. `extends` в `_site.yaml` указывает
имя папки родительской локали, чьи настройки берутся за основу:

```yaml
# src/en-GB/_site.yaml
extends: en
lang: en-GB
title: My Blog
```

Значение — имя папки, а не путь к файлу. Наследуется **всё** из `_site.yaml`
родителя: `lang`, `title`, `description`, `themeConfig` и переводы `t`.
Объекты объединяются рекурсивно (deep-merge), поэтому переопределять
достаточно отличия.

`lang` стоит указывать явно — именно он попадает в `<html lang>`, `hreflang` и
форматирование дат. Если унаследовать `lang: en` от родителя, страница
`/en-GB/` будет помечена как английская, хотя URL и контент — британские.

Цепочки `extends` поддерживаются на любую глубину — `en-GB` может наследовать
от `en`, а `en-US` от `en-GB`. Тема обнаруживает циклы (`en → en-GB → en`) и
прерывает их с предупреждением в консоль.

## Форматирование

Там, где формат зависит от языка, тема опирается на `lang` страницы, а не на имя
папки локали:

- даты форматируются по разрешённому `lang` страницы через `Intl.DateTimeFormat`;
- SEO-теги и `hreflang` используют значение `lang` локали.

Например, дата публикации `2026-08-05` с `lang: ru` отформатируется как
`5 августа 2026 г.`, а с `lang: en` — как `August 5, 2026`. Поэтому важно
задавать `lang` в `_site.yaml` каждой локали — именно он определяет,
на каком языке читатель увидит даты, а не имя папки.

## Доступ к переводам из кода

В собственных компонентах переводы текущей локали доступны через composables:

- **`useTranslations()`** — реактивный объект `t` текущей локали;
- **`useContentLangs()`** — текущая локаль и список всех доступных.

```ts
import { useTranslations, useContentLangs } from 'vitepress-theme-neptu/composables'

const t = useTranslations()
const { localeIndex, locales } = useContentLangs()
```

Полный справочник composables — в [Компонентах](components#composables).

## RTL-языки (арабский, иврит)

Во встроенном наборе есть RTL-языки: арабский (`ar`) и иврит (`he`) — со всеми
переводами интерфейса. Однако тема **не переключает направление текста
автоматически**. VitePress устанавливает `<html lang>`, но не `dir="rtl"`,
а в CSS темы нет RTL-флипа — только точечные `/*rtl:ignore*/`-комментарии
в scoped-стилях переключателя темы.

Чтобы использовать RTL-локаль полноценно:

1. Задайте `dir: rtl` в `_site.yaml` — это поле попадёт на страницу выбора
   языка (`LocaleSelector` проставит `dir` на ссылке).
2. Добавьте `dir="rtl"` в `<html>` через `head` в `config.ts` или через
   собственный `Layout.vue` для конкретной локали.
3. Учтите, что встроенные CSS-стили темы рассчитаны на LTR — потребуется
   дополнительная стилизация для зеркального отображения сайдбара, навигации
   и других элементов интерфейса.

## Добавление новой локали

Создайте папку `src/<locale>/` с файлом `_site.yaml`. Дальнейшее зависит от того,
есть ли язык среди встроенных.

**Региональный вариант** (`en-GB`, `es-MX`) — унаследуйте всё от базовой локали
через `extends` и переопределите только отличия. Контент будет доступен по своему
URL, переводы интерфейса — от родителя (см. [Наследование локалей](#наследование-локалей-extends)).

```yaml
# src/en-GB/_site.yaml
extends: en
lang: en-GB
```

**Язык не из встроенного набора** (`uk`, `vi`) — задайте `lang`, `label` и ключи `t`.
Остальные строки унаследуются от английского через фолбэк, поэтому переводить
можно постепенно — начните с заметных (`search`, `tags`, `categories`,
`readingTime`, `links.*`).

```yaml
# src/uk/_site.yaml
lang: uk
label: Українська
themeConfig:
  t:
    search: 'Пошук'
    tags: 'Теги'
    categories: 'Категорії'
    readingTime: 'Час читання'
    links:
      aboutBlog: 'Про блог'
      donate: 'Підтримати'
```

Если отдельного контента для региональной локали нет и нужен редирект
`/en-US/*` → `/en/*`, настройте `301`/`308` на хостинге (`_redirects` для Netlify,
`vercel.json` для Vercel, rules для Cloudflare) — это правило развёртывания,
а не часть темы.

## Что дальше

- [Локали и мультиязычность](locales) — маршрутизация, именование локалей, добавление языка.
- [Связывание переводов и hreflang](i18n-hreflang) — `translations` и теги для поисковиков.
