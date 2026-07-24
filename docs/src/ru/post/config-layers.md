---
title: Уровни конфигурации
description: Тема объединяет настройки из четырех уровней. На этой странице объясняется назначение каждого уровня и то, какой из них следует редактировать.
date: 2025-05-20T09:00:00Z
authorId: ivan-k
tags:
  - guide
  - config
---

# Уровни конфигурации

Настройки темы формируются путём объединения **четырёх уровней** в порядке приоритета. Более поздние
уровни переопределяют значения предыдущих:

```
встроенные значение по умолчанию
  → .vitepress/config.ts        (для разработчиков, требует кода)
    → src/site.yaml             (для редакторов, общие для всех локалей)
      → src/<locale>/_site.yaml (для редакторов, отдельно для каждой локали)
```

## Какой файл редактировать?

| Я хочу изменить… | Файл для редактирования |
| --- | --- |
| `siteUrl`, значения из переменных окружения, Vite-плагины, поиск, популярные посты (GA4) | `.vitepress/config.ts` |
| Оформление, общее для всех локалей (футер, издатель, иконки, переключатели SEO) | `src/site.yaml` |
| Локализованную идентичность и переопределения (`lang`, `blogTitle`, подписи навигации, переводы) | `src/<locale>/_site.yaml` |

**Правило:** если настройка требует JavaScript или секретов, она помещается в `config.ts`.
Если её может захотеть изменить редактор контента, используйте YAML.

## Уровень 1 — `.vitepress/config.ts`

Подключение на уровне кода. Здесь вызывается `defineBlogConfig` и автоматически обнаруживаются
папки локалей (любая папка `src/<locale>/`, содержащая `_site.yaml`).

```ts
// .vitepress/config.ts (выдержка)
export default async () => {
  const config: BlogUserConfig = {
    srcDir: path.resolve(__dirname, '../'),
    siteUrl: 'https://myblog.org', // абсолютный URL без завершающего слэша —
                                   // используется для canonical, sitemap, RSS, OG, hreflang
    themeConfig: {
      repo: 'https://github.com/your-org/your-blog',
      perPage: 10,
      search: { provider: 'pagefind', options: { bodyMarker: 'data-pagefind-body' } },
      popularPosts, // зависит от env (GA4), остаётся в коде
    },
  }
  return defineBlogConfig(config)
}
```

## Уровень 2 — `src/site.yaml` (межлокальный)

Всё в разделе `themeConfig:`, что **одинаково для всех локалей**, но редактор контента
может захотеть изменить без правки кода:

```yaml
themeConfig:
  publisher:
    logo: 'https://myblog.org/logo.png'
  editLink:
    pattern: 'https://github.com/your-org/your-blog/edit/main/src/:path'
  sidebar:
    popular: true
    recent: true
    archive: true
    authors: true
    tags: true
```

## Уровень 3 — `src/<locale>/_site.yaml` (для конкретной локали)

Локализованная идентичность и переопределения для данного языка. Ключи верхнего уровня:
`lang`, `title`, `titleTemplate`, `description`; всё остальное вложено в `themeConfig:`.

```yaml
lang: 'ru-RU'
description: 'Демонстрационный блог'
themeConfig:
  blogTitle: 'Тема Neptu для блога'
  footer:
    copyright: 'Copyright © 2026 Your Name.'
```

## Шаблонизация строк в YAML

Внутри любого `_site.yaml` можно подставлять динамические значения (подставляются перед
парсингом YAML):

| Шаблон | Во что разворачивается |
| --- | --- |
| `${theme.<key>}` | любое объединённое значение `themeConfig`, например `${theme.repo}` |
| `${t.<key>}` | строка перевода, например `${t.links.donate}` |
| `${config.siteUrl}` | URL сайта из `config.ts` |
| `${localeIndex}` | имя папки текущей локали, например `ru` |

```yaml
publisher:
  name: '${theme.blogTitle}'
  url: '${config.siteUrl}'
nav:
  socialLinks:
    - icon: 'fa6-brands:github'
      link: '${theme.repo}'
```

## Поддержка двух форматов (YAML и TypeScript)

Каждый admin-файл поддерживает как **YAML**, так и **TypeScript** с тем же базовым именем:

- `site.yaml` ↔ `site.ts`
- `_site.yaml` ↔ `_site.ts`
- `_authors.yaml` ↔ `_authors.ts`

TypeScript имеет приоритет. Если `.ts`-файл существует, `.yaml` игнорируется. Это позволяет
разработчикам использовать типобезопасную конфигурацию, пока редакторы работают с YAML.

### TypeScript-хелперы

Импортируйте хелперы из `vitepress-theme-neptu-blog/configs` для автодополнения:

```ts
// site.ts
import { defineSiteConfig } from 'vitepress-theme-neptu-blog/configs'
export default defineSiteConfig({
  themeConfig: {
    nav: [{ text: 'Главная', link: '/' }],
  },
})
```

```ts
// src/ru/_site.ts
import { defineLocaleConfig } from 'vitepress-theme-neptu-blog/configs'
export default defineLocaleConfig({
  lang: 'ru',
  title: 'Мой блог',
  themeConfig: {
    footer: { message: 'Сделано на VitePress' },
  },
})
```

```ts
// src/ru/_authors.ts
import { defineAuthorsList } from 'vitepress-theme-neptu-blog/configs'
export default defineAuthorsList([
  { id: 'alice', name: 'Alice', link: [{ title: 'GitHub', url: 'https://github.com/alice' }] },
])
```

## Автообнаружение локалей

Обнаружение локалей — это код уровня разработчика в `.vitepress/config.ts`.
`defineBlogConfig` сканирует `srcDir` на наличие прямых дочерних папок, содержащих
`_site.yaml` или `_site.ts`, и регистрирует каждую как локаль VitePress. Папки, начинающиеся
с `.` или `_`, игнорируются.

Для администраторов добавление локали — это файловая операция:

1. Создайте `src/<locale>/`.
2. Добавьте `src/<locale>/_site.yaml` или `_site.ts`.
3. Добавьте контент локали и опционально `src/<locale>/_authors.yaml`.

Изменения в `.vitepress/config.ts` для каждой новой локали не требуются.

## Наследование через `extends` в `_site.yaml`

Локаль может наследовать конфигурацию другой локали через `extends`:

```yaml
# src/en-US/_site.yaml
extends: ../en/_site.yaml

themeConfig:
  nav:
    - text: Home
      link: /
```

Родительский файл загружается первым, затем дочерний переопределяет его. Циклы
обнаруживаются и сообщаются как ошибка.

## Стратегия слияния авторов

Авторы загружаются из двух источников и сливаются по `id`:

1. `themeConfig.authors` внутри `_site.yaml`
2. `_authors.yaml` (или `_authors.ts`) в той же папке локали

Если оба файла определяют автора с одинаковым `id`, **отдельный файл побеждает**.
Новые авторы из отдельного файла добавляются в конец списка.

## Валидация

Admin-редактируемый YAML валидируется Zod-схемами. Неверные поля вызывают
**предупреждения** в консоли, но не ломают сборку. Это позволяет редакторам
быстро итерировать, пока опечатки всё равно отлавливаются.

Схемы находятся в `src/configs/siteSchema.ts`.

## Поддержка редакторов

YAML-файлы включают ссылку на схему для редакторов с поддержкой `yaml-language-server`:

```yaml
# yaml-language-server: $schema=../../schema/site.schema.json
```

Это обеспечивает автодополнение и валидацию прямо в VS Code с расширением YAML.

JSON-схемы расположены в `schema/site.schema.json` и `schema/authors.schema.json`.

## Горячая перезагрузка admin-файлов

Во время разработки изменения в `site.yaml`, `_site.yaml` или `_authors.yaml` автоматически
перезапускают dev-сервер VitePress, чтобы правки сразу отображались.

Включите плагин в `.vitepress/config.ts`:

```ts
import { defineBlogConfig, createSiteYamlHotReloadPlugin } from 'vitepress-theme-neptu-blog/configs'

export default async () =>
  defineBlogConfig({
    vite: {
      plugins: [
        createSiteYamlHotReloadPlugin('/absolute/path/to/src'),
      ],
    },
  })
```

Плагин отслеживает все `.yaml` и `.ts` варианты конфигурационных файлов и вызывает
перезапуск сервера при изменениях.

## Правила формы YAML

- Ключи верхнего уровня в admin-файлах ограничены: `lang`, `title`, `titleTemplate`, `description`, `extends`.
- Всё, что относится к теме, находится под `themeConfig:`.
- Нет краткого синтаксиса верхнего уровня для `nav`, `sidebar`, `footer`, `donate`,
  `publisher`, `authors`, `socialMediaShares` или `t`.

Минимальный пример `_site.yaml`:

```yaml
# yaml-language-server: $schema=../../schema/site.schema.json
lang: ru
title: Мой блог
description: Заметки об инженерии

themeConfig:
  nav:
    - text: Посты
      link: /posts/
  footer:
    message: Сделано на VitePress
```
