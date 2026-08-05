---
title: Карточки постов и кнопки «поделиться»
description: >
  Управляйте тем, что отображается в карточках постов (previewText /
  descrAsPreview / maxPreviewLength), и настраивайте кнопки шерингa
  соцсетей — добавить свою, убрать встроенную или поменять оформление.
authorId: ivan-k
date: 2026-07-28
category: { name: 'Продвинутое', slug: 'advanced' }
tags: [frontmatter, config]
descrAsPreview: true
---

Карточки постов в списках (например, на страницах **Свежие посты**, **Теги** и
**Авторы**) отображают краткое превью. По умолчанию тема генерирует превью из
начала текста поста, но его можно переопределить.

В подвале поста выводятся кнопки шерингa соцсетей — они работают без настройки,
но их можно переопределить, дополнить или убрать.

## Три способа управления превью

**1. Автоматический (по умолчанию).** Ничего не делайте — тема сделает выжимку из текста статьи
длиной до `maxPreviewLength` символов.

**2. Использование описания.** Установите `descrAsPreview: true`, чтобы использовать поле `description`
из frontmatter как текст карточки (так сделано в большинстве демо-постов).

**3. Явный текст.** Задайте `previewText`, чтобы вручную написать текст карточки. Используйте
`descrAsPreview` **или** `previewText`, но не оба вместе.

```yaml
# Явный текст превью:
previewText: "Текст этой карточки задан явно через previewText…"

# Или альтернативный вариант:
# descrAsPreview: true
```

## Длина превью

Длину автоматического превью задавайте **только в `config.ts`**: текст обрезается
на этапе сборки в data-лоадере локали, а он читает именно этот экспорт:

```ts
// .vitepress/config.ts
export const postList = { maxPreviewLength: 300 }
```

Ключ `postList.maxPreviewLength` в YAML схема тоже примет, но на уже обрезанный
текст карточки он не повлияет — не дублируйте его там.

## Элементы карточки

Отображение элементов карточки (дата, теги, миниатюра, автор) настраивается в YAML:

```yaml
# src/site.yaml
themeConfig:
  postList:
    showDate: true
    showTags: true
    showThumbnail: true
    showPreview: true
    showAuthor: true
```

## Кнопки «поделиться»

Блок `social-share` в подвале поста выводит кнопки шерингa соцсетей. Каждая
локаль приносит свой готовый набор — для русской это Telegram, WhatsApp, VK, X,
Facebook и LinkedIn. Они работают без настройки.

Список из `site.yaml` и `_site.yaml` **объединяется со встроенным по ключу
`name`**, а не заменяет его. Из этого следуют три приёма:

```yaml
# src/site.yaml
themeConfig:
  socialMediaShares:
    # 1. Поменять оформление встроенной кнопки — совпало имя, поля перекрылись
    - name: telegram
      icon: 'logos:telegram'
      title: 'Телеграм'

    # 2. Добавить свою сеть — новое имя дописывается в конец
    - name: bluesky
      icon: 'simple-icons:bluesky'
      title: 'Bluesky'
      urlTemplate: 'https://bsky.app/intent/compose?text={title}%20{url}'

    # 3. Убрать встроенную кнопку
    - name: vk
      enabled: false
```

Поля записи:

| Поле | Описание |
| --- | --- |
| `name` | Ключ объединения — по нему запись находит встроенную |
| `icon` | Имя иконки [Iconify](https://icones.es), например `logos:telegram` |
| `title` | Подпись и tooltip |
| `urlTemplate` | Ссылка шеринга с плейсхолдерами `{url}` и `{title}` |
| `class` | Необязательные CSS-классы кнопки |
| `enabled` | `false` скрывает кнопку, не удаляя её из конфигурации |

`{url}` и `{title}` подставляются из текущей страницы. UTM-метки пишутся прямо в
шаблон:

```yaml
urlTemplate: 'https://x.com/intent/tweet?text={title}&url={url}%3Futm_source%3Dshare'
```

::: warning Пустой массив не скрывает блок
`socialMediaShares: []` не выключает шеринг: пустой список означает «нечего
объединять», и остаётся встроенный набор. Чтобы убрать блок, уберите
`social-share` из `postFooter` — либо пометьте каждую кнопку `enabled: false`.
:::

Порядок блоков подвала поста (включая `social-share`) задаётся массивом
`postFooter` — см. [Настройки themeConfig](themeconfig-settings#подвал-поста).
