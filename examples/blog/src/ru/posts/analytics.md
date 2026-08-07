---
title: Аналитика и популярные посты
description: >
  Как подключить счётчик аналитики (GA4, Яндекс.Метрика, Plausible) и включить
  список популярных постов на основе реальных просмотров из Google Analytics 4.
authorId: ivan-k
date: 2026-08-04
category: integration
tags: [advanced, config, analytics]
descriptionAsPreview: true
---

Сбор статистики просмотров блога состоит из двух частей:
1. **Клиентский счётчик** — отслеживает посещения страниц читателями.
2. **Серверный агрегатор популярных постов** — обращается к GA4 Data API на этапе сборки сайта и формирует рейтинг наиболее читаемых статей.

## Подключение счётчика аналитики

Счётчик аналитики вы добавляете в секцию `head` конфигурации `.vitepress/config.ts`. Тема автоматически ставит скрипт Google Consent Mode v2 **перед** вашими тегами, поэтому `gtag.js` сразу учитывает сигналы согласия и придерживает куки до ответа посетителя. Подробней о согласии тут [Согласие на куки (GDPR и CMP)](consent).

### Google Analytics 4

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  head: [
    // Скрипт согласия тема ставит перед этим блоком автоматически
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer=window.dataLayer||[];` +
        `function gtag(){dataLayer.push(arguments)}` +
        `gtag('js',new Date());gtag('config','G-XXXXXXXXXX');`,
    ],
  ],
})
```

### Cookieless-аналитика (Plausible, Umami, GoatCounter)

Счётчики без использования куки-файлов обычно не требуют показа баннера согласия (GDPR / ePrivacy):

```ts
// .vitepress/config.ts
export default async () => defineBlogConfig({
  head: [
    [
      'script',
      {
        defer: '',
        'data-domain': 'yourdomain.com',
        src: 'https://plausible.io/js/script.js',
      },
    ],
  ],
})
```

---

## Популярные посты через GA4

«Популярные посты» — это список статей, отсортированный по реальным просмотрам из **Google Analytics 4**. В отличие от «свежих» (по дате) и «избранных» (вручную), популярность определяется автоматически — на основе данных, которые GA4 уже собирает.

### Как это работает

Статистика запрашивается у GA4 **на этапе сборки** — один раз. Результат «запекается» в статические страницы: никаких клиентских запросов к Google API после сборки, приватный ключ используется только на сервере сборки и не попадает в браузер читателя.

На этапе сборки тема запрашивает GA4 Data API и получает следующую информацию: просмотры, уникальные посетители и среднюю длительность сессии для каждого пути. Далее сортирует страницы по популярности для списка популярных постов.

::: info
Если данных нет, сеть недоступна или ключ неверен — тема выводит предупреждение и **сборка продолжается**. Список популярных просто остаётся пустым.
:::

### Настройка GA4

#### 1. Создание Service Account

1. Откройте [Google Cloud Console](https://console.cloud.google.com/).
2. Создайте проект (или выберите существующий).
3. Включите **Google Analytics Data API** — **APIs & Services → Library** →
   найдите «Google Analytics Data API» → **Enable**. Без этого API вернёт 403.
4. Перейдите в **IAM & Admin → Service Accounts** и создайте новый Service Account.
5. Нажмите на созданный аккаунт → **Keys** → **Add Key** → **Create new key** → выберите **JSON**.
6. Скачайте файл — это и есть ваши credentials.

#### 2. Добавление в Google Analytics

1. Откройте [Google Analytics](https://analytics.google.com/).
2. Выберите ваш ресурс (property) GA4.
3. Перейдите в **Admin → Property access management**.
4. Нажмите **Add users** и вставьте `client_email` из скачанного JSON-ключа с ролью **Viewer** (Читатель).

#### 3. Получение Property ID

Property ID — это числовой идентификатор ресурса GA4. Найти его можно в **Admin → Property settings** — поле **Property ID**. Он выглядит как `123456789`.

#### 4. Передача credentials

**Никогда не коммитьте JSON-ключ в репозиторий**. Передавайте данные через переменные окружения:

```bash
GA_PROPERTY_ID=123456789
GA_CREDENTIALS_JSON='{"type": "service_account", "client_email": "...", "private_key": "...", ...}'
```

### Включение в конфиге

Настройка популярных постов производится в конфигурации первого уровня (`.vitepress/config.ts`): здесь живут credentials, env-переменные и интеграции. Подробнее об уровнях — в [Уровнях конфигурации](config-layers).

```ts
// .vitepress/config.ts
export const popularPosts = {
  // Включить интеграцию с GA4 (по умолчанию: false)
  enabled: true,
  // Метрика сортировки: 'pageviews' | 'uniquePageviews' | 'avgTimeOnPage' (по умолчанию: 'pageviews')
  sortBy: 'pageviews',
  dataSource: {
    // Провайдер данных (пока только GA4)
    provider: 'ga4',
    // Property ID ресурса GA4 (по умолчанию: null)
    propertyId: process.env.GA_PROPERTY_ID,
    // Содержимое JSON-ключа как строка (по умолчанию: null)
    credentialsJson: process.env.GA_CREDENTIALS_JSON,
    // Глубина выборки в днях (по умолчанию: 30)
    // dataPeriodDays: 30,
    // Максимум строк от GA (по умолчанию: 1000)
    // dataLimit: 1000,
  },
} satisfies NonNullable<ThemeConfig['popularPosts']>

export default async () => defineBlogConfig({
  // ... остальные настройки
  themeConfig: {
    popularPosts,
  },
})
```

::: info
Значение `popularPosts` используется дважды: его импортирует data-лоадер локали (`loadPosts.data.ts`) и оно же попадает в `themeConfig.popularPosts`.
:::

#### Метрики сортировки

| Значение | Метрика GA4 | Что измеряет |
| --- | --- | --- |
| `pageviews` | `screenPageViews` | Всего просмотров страницы |
| `uniquePageviews` | `totalUsers` | Уникальные посетители (число пользователей, а не уникальных просмотров) |
| `avgTimeOnPage` | `averageSessionDuration` | Среднее время сессии |

Посты без статистики (например, новые статьи, ещё не попавшие в выборку) сортируются по дате — новые выше.

### Включение отображения

После включения интеграции в `config.ts` нужно включить блоки отображения в `site.yaml` (уровень 2) или `_site.yaml` (уровень 3). На странице автора и в архиве автоматически появятся пререключатели сортировки списков по популярным постам.

#### Сайдбар

```yaml
# src/site.yaml
themeConfig:
  sidebar:
    popular: true    # секция «Популярное» в сайдбаре
```

#### Главная страница

```yaml
# src/site.yaml
themeConfig:
  home:
    sections:
      - { type: popular, enabled: true, limit: 5 }
```

`limit` ограничивает количество статей. Без него показывается одна страница — значение `perPage`. Пустая секция не рисуется: пока данных нет, блок просто не появится. Подробнее — в [Домашней странице](home-page).

---

## Что дальше

- [Согласие на куки (GDPR и CMP)](consent) — Consent Mode v2, CMP, баннеры согласия и `useConsent()`.
- [Рекламные блоки](ads) — где размещаются блоки и как их подключить.
- [Публикация и деплой](deploy) — проброс секретов GA4 в CI/CD.
