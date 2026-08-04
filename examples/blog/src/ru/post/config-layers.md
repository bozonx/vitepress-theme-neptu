---
title: Уровни конфигурации
description: 'Три понятных уровня: код и интеграции, общие настройки, настройки одной локали.'
authorId: ivan-k
date: 2026-07-20
category: { name: 'Настройка', slug: 'configuration' }
tags: [config]
descrAsPreview: true
---

У блога **три редактируемых уровня**. Встроенные настройки темы и языка — это внутренняя база, а не четвёртый файл пользователя. Следующий уровень переопределяет предыдущий.

```text
1. .vitepress/config.ts            разработчик: код, сборка, интеграции
   → 2. src/site.yaml              администратор: общее для всех локалей
     → 3. src/<locale>/_site.yaml  администратор: одна локаль и её отличия
```

## Какой файл редактировать

| Что меняется | Файл |
| --- | --- |
| `srcDir`, `base`, `siteUrl`, `repo`, env, Vite/VitePress, плагины, хуки, Pagefind, GA4 и секреты | `.vitepress/config.ts` |
| Оформление и поведение, одинаковые для языков: бренд, sidebar, nav, footer, ленты, SEO, иконки, publisher | `src/site.yaml` |
| Язык, заголовок, описание, переводы, подписи и намеренные отличия одного языка | `src/<locale>/_site.yaml` |
| Профили авторов одной локали | `src/<locale>/_authors.yaml` |

YAML — **не полный VitePress-конфиг**. В нём не бывает плагинов, хуков, `base`, `srcDir` и `siteUrl`: это исключительная ответственность первого уровня. Благодаря этому редактор не увидит секреты и не сломает сборку.

## Уровень 1 — `.vitepress/config.ts`

Это единственный файл разработчика и обычный `BlogUserConfig` / VitePress config. Полный список стандартных полей VitePress остаётся в [справочнике VitePress](https://vitepress.dev/reference/site-config). В теме здесь размещаются только проводка и интеграции:

| Поле | Назначение |
| --- | --- |
| `srcDir` | Корень контента и автообнаружения локалей. |
| `base` | Публичный подкаталог, например `/blog/`. |
| `siteUrl` | Абсолютный URL для sitemap, лент, canonical, Open Graph и JSON-LD. |
| `themeConfig.repo` | Репозиторий исходников; задаёт edit-link и ссылки на репозиторий. |
| `head` | Внешние ассеты и метаданные. |
| `vite`, `markdown`, `sitemap` | Обычные настройки VitePress/Vite. |
| `transformPageData`, `transformHead`, `buildEnd` | Пользовательские хуки после хуков темы. |
| `themeConfig.search` | Провайдер Pagefind, опции UI и индексация при сборке. |
| `themeConfig.popularPosts.enabled`, `.dataSource` | GA4; интеграция выключена по умолчанию, credentials и env остаются здесь. |

```ts
export default async () => defineBlogConfig({
  srcDir: path.resolve(__dirname, '../'),
  base: process.env.VITEPRESS_BASE || '/',
  siteUrl: process.env.SITE_URL || 'https://example.com',
  themeConfig: {
    repo: 'https://github.com/acme/my-blog',
    search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
    popularPosts: {
      enabled: true,
      dataSource: { provider: 'ga4', propertyId: process.env.GA_PROPERTY_ID },
    },
  },
})
```

## Уровень 2 — `src/site.yaml`

В этом файле один рабочий ключ верхнего уровня: `themeConfig`. Это полный самодокументирующий справочник безопасных общих настроек. Укажите здесь значение по умолчанию для всех локалей; не копируйте его в каждый язык.

В `themeConfig` документированы группы: общие (`blogTitle`, переключатели, `defaultColorTheme`, `defaultStylePreset`), главная (`home`), списки (`postList`, `postFooter`), иконки, sidebar, `nav`, donate, edit link, footer, publisher, authors, social sharing, feeds, SEO, `popularPosts.sortBy` и переводы `t`. Каждое поле прокомментировано прямо в `packages/blog/template/src/site.yaml`.

Укажите `repo` в `.vitepress/config.ts`. Тема сама построит `editLink.pattern`
для GitHub, GitLab, Bitbucket, Gitea, Forgejo и Codeberg, предполагая ветку
`main` и каталог `src/`. Обычно в локали достаточно задать `editLink.text`;
`editLink.pattern` нужен только для нестандартной ветки или пути к исходникам.

**Исключение — `perPage`:** В отличие от остальных полей `themeConfig`, `perPage` **нельзя** задавать в `site.yaml` или `_site.yaml`. Это build-time параметр: генераторы путей (`*.paths.js`) импортируют его на этапе сборки для расчёта маршрутов пагинации. Значение в YAML рассинхронизирует сгенерированные маршруты и рантайм. Настраивайте `perPage` только в `.vitepress/config.ts` (например, `export const PER_PAGE = 10` и `themeConfig: { perPage: PER_PAGE }`). Схема отклоняет `perPage` в YAML и выводит предупреждение при сборке.

Объекты объединяются рекурсивно, массивы заменяются целиком. Исключение — `authors`: записи объединяются по стабильному `id`.

## Уровень 3 — `src/<locale>/_site.yaml`

Это настройки одной локали. Допустимые поля верхнего уровня ровно такие:

| Поле | Назначение |
| --- | --- |
| `lang` | IETF-тег: `ru-RU`, `en-US`. |
| `title` | Название сайта на этом языке. |
| `titleTemplate` | Шаблон заголовка страницы с `:title`. |
| `description` | Локализованное SEO/feed-описание. |
| `extends` | Имя папки родительской локали, например `en`; не путь к файлу. |
| `themeConfig` | Любая безопасная настройка второго уровня как локальное переопределение. |

```yaml
# src/ru/_site.yaml
extends: en
lang: ru-RU
title: Пример блога
description: Заметки для русскоязычных читателей.
themeConfig:
  blogTitle: Пример блога
  langMenuLabel: Сменить язык
  nav:
    links:
      - text: О блоге
        href: page/about
```

Общее значение оставляйте на уровне 2. Здесь переопределение должно быть осознанным: другой текст, язык, локальный URL или действительно отличающийся интерфейс.

### Точечные переопределения `themeConfig`

Объекты объединяются рекурсивно между уровнями, поэтому можно переопределять отдельные подключи, не переписывая весь блок. Укажите только то, что отличается для этой локали — остальное унаследуется от уровня 2.

```yaml
# src/en/_site.yaml — переопределяем только нужные подключи
themeConfig:
  # Скрыть превью на карточках постов, остальное из site.yaml сохраняется
  postList:
    showPreview: false

  # Другой порядок блоков в подвале поста для этой локали
  postFooter:
    - author
    - tags
    - social-share
```

Это работает для любого вложенного ключа `themeConfig`: `sidebar`, `nav`, `footer`, `donate`, `editLink`, `socialMediaShares`, `seo`, `feeds` и т. д. Полный справочник параметров — в `packages/blog/template/src/site.yaml`; не дублируйте параметры, уже определённые там.

## Авторы — `_authors.yaml`

Файл — массив профилей. Обязателен только `id`; остальные поля: `name`, `description`, `image`, `imageWidth`, `imageHeight`, `twitterHandle`, `links[]` (`type`, `url`, `title`). Пример и комментарии находятся рядом в шаблоне. Записи сливаются с `themeConfig.authors` по `id`; отдельный `_authors.yaml` имеет приоритет для совпадающего поля.

## Шаблоны и валидация YAML

Только YAML поддерживает подстановки до разбора:

| Шаблон | Значение |
| --- | --- |
| `${theme.key}` | объединённое значение темы. |
| `${site.title}` | итоговое название сайта для локали. |
| `${t.key}` | встроенный или переопределённый перевод. |
| `${config.siteUrl}` | URL из `config.ts`. |
| `${localeIndex}` | имя текущей папки локали. |

Файлы подключают `site.schema.json` и `authors.schema.json` для автодополнения в редакторе. Схемы перечисляют все публичные поля Neptu; неизвестные поля сохраняются для совместимости с будущими расширениями VitePress. TypeScript-варианты `site.ts`, `_site.ts`, `_authors.ts` имеют приоритет над YAML; для них есть `defineSiteConfig`, `defineLocaleConfig`, `defineAuthorsList`.

## Пользовательские поля в `themeConfig`

В `themeConfig` можно добавлять **любые собственные поля** — они проходят через весь конвейер слияния и доступны в рантайме через `useUiTheme()`. Объекты рекурсивно объединяются между уровнями, массивы заменяются целиком.

```yaml
# src/site.yaml
themeConfig:
  myCustomField: "hello"
  myCustomConfig:
    featureEnabled: true
    apiUrl: "https://api.example.com"
```

Доступ в Vue-компоненте:

```vue
<script setup lang="ts">
import { useUiTheme } from 'vitepress-theme-neptu/composables'

const { theme } = useUiTheme()
console.log(theme.value.myCustomField)   // "hello"
console.log(theme.value.myCustomConfig)  // { featureEnabled: true, apiUrl: "..." }
</script>
```

Поля можно задавать на любом уровне: `config.ts`, `site.yaml` или `_site.yaml`. Значения сливаются по приоритету — от низкого к высокому.
