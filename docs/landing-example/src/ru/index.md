---
layout: landing

# Декларативный режим: страница целиком описана данными.
# Ни строчки Vue — layout сам читает этот массив из frontmatter.
blocks:
  - type: banner
    bg: brand
    badge: v0.20
    icon: fa6-solid:bolt
    text: 'Вышла версия 0.20 — шесть новых блоков и правки доступности'
    link: /ru/doc/blocks
    linkText: Что нового
    dismissible: true
    storageKey: ln-demo-banner-0-20

  - type: hero
    variant: split
    padding: lg
    glow: true
    eyebrow: Лендинг-тема для VitePress
    title: 'Весь сайт собирается из <span class="ln-accent">блоков</span>'
    text: Лендинг на главной, документация рядом, единая тема для всего. Палитра и стиль переключаются прямо в шапке.
    note: Эта страница целиком описана в YAML
    image: /img/demo/shot-2.svg
    actions:
      - text: Начать
        link: /ru/doc
        variant: brand
      - text: Все блоки
        link: /ru/doc/blocks
        variant: alt

  - type: code
    bg: soft
    align: center
    eyebrow: Установка
    title: Одна команда — и тема на месте
    text: 'Дальше только контент: layout, blocks и ваши тексты.'
    items:
      - label: npm
        lang: bash
        code: npm i vitepress-theme-neptu-landing
      - label: pnpm
        lang: bash
        code: pnpm add vitepress-theme-neptu-landing
      - label: yarn
        lang: bash
        code: yarn add vitepress-theme-neptu-landing
      - label: theme/index.ts
        lang: ts
        code: |
          import LandingTheme from 'vitepress-theme-neptu-landing'

          export default LandingTheme
        caption: Всё — блоки зарегистрированы глобально.

  - type: content
    eyebrow: Редакционный контент
    title: Гибкая секция для текста между витринами
    content: '<p>Используйте доверенный HTML для подробных объяснений, миссии и служебных примечаний.</p>'
    actions: [{ text: Читать руководство, link: /ru/doc, variant: alt }]

  - type: collection
    bg: soft
    eyebrow: Ресурсы
    title: Карточки не только для возможностей
    items:
      - { title: Быстрый старт, text: Короткое руководство., date: '2026-07-27', tags: [Гайд], link: /ru/doc, linkText: Читать }
      - { title: Справочник блоков, text: Все props и варианты., meta: [24 блока], link: /ru/doc/blocks, linkText: Смотреть }
      - title: Темизация
        text: Выберите один production-пресет.
        tags: [CSS, Токены]
        actions: [{ text: Открыть, link: /ru/doc/theming }]

  - type: embed
    eyebrow: Встраивание
    title: Карты, календари и виджеты
    text: iframe загружается лениво и получает доступное название.
    src: /ru/doc/about
    embedTitle: Встроенный пример документации
    ratio: 21/9

  - type: logos
    bg: soft
    variant: marquee
    eyebrow: Нам доверяют
    items:
      - { src: /img/demo/logo-1.svg, alt: Acme }
      - { src: /img/demo/logo-2.svg, alt: Globex }
      - { src: /img/demo/logo-3.svg, alt: Umbra }
      - { src: /img/demo/logo-4.svg, alt: Initech }
      - { src: /img/demo/logo-5.svg, alt: Hooli }
      - { src: /img/demo/logo-6.svg, alt: Vandelay }

  - type: features
    id: features
    align: center
    eyebrow: Возможности
    title: Всё, что нужно сайту проекта
    text: Все блоки принимают один и тот же набор секционных пропсов — фон, ширину, отступы, выравнивание.
    cols: 3
    items:
      - icon: fa6-solid:cubes
        title: Блоки вместо вёрстки
        text: Двадцать четыре готовые секции. Страница собирается из них, а не пишется руками.
      - icon: fa6-solid:palette
        title: Две оси темы
        text: Цвет и стиль независимы — восемь палитр на пять стилевых пресетов.
      - icon: fa6-solid:file-code
        title: YAML или Vue
        text: Страницу можно собрать компонентами или описать данными во frontmatter.
      - icon: fa6-solid:magnifying-glass
        title: SEO из коробки
        text: Open Graph, JSON-LD, hreflang, canonical и sitemap — унаследованы от блог-темы.
      - icon: fa6-solid:language
        title: Мультиязычность
        text: Папки локалей, слои YAML-конфигов, подстановка шаблонов и hreflang.
      - icon: fa6-solid:robot
        title: Понятно ИИ-агентам
        text: Единый контракт пропсов, JSON-схема для YAML-режима и AGENTS.md с рецептами.

  - type: bento
    bg: soft
    align: center
    eyebrow: Внутри
    title: Скучные технологии — намеренно
    cols: 3
    items:
      - icon: fa6-solid:bolt
        title: Ноль рантайм-зависимостей
        text: Карусель — CSS scroll-snap, аккордеон — &lt;details&gt;, лайтбокс — &lt;dialog&gt;.
        span: 2
      - icon: fa6-solid:universal-access
        title: Доступность
        text: Клавиатура, фокус-кольца и уважение к prefers-reduced-motion.
      - icon: fa6-solid:mobile-screen
        title: Адаптивность
        text: Плавные размеры на clamp() — без каши из брейкпоинтов.
      - icon: fa6-solid:paintbrush
        title: Тема меняется до последнего радиуса
        text: Блоки читают только --ln-* токены. Тридцать переменных — и это новая тема.
        span: 2

  - type: feature-split
    id: authoring
    eyebrow: Два способа сборки
    title: Компоненты или данные — на выбор
    items:
      - eyebrow: Разметка
        title: Собирать в markdown
        text: Блоки зарегистрированы глобально — ни импортов, ни сборки. Вставили компонент и передали данные.
        bullets: [Одинаковые пропсы у всех блоков, Слоты для замены любой части, Работает в любой локали]
        image: /img/demo/shot-1.svg
        actions: [{ text: Смотреть API, link: /ru/doc/blocks, variant: alt }]
      - eyebrow: Конструктор
        title: Или описать страницу в YAML
        text: Массив <code>blocks:</code> во frontmatter рендерится одним компонентом. Контент отделён от разметки — это упрощает переводы и правки через CMS.
        bullets: [Один рендерер на двадцать четыре типа, Проверка по JSON-схеме, Готово к подключению CMS]
        image: /img/demo/shot-2.svg
        actions: [{ text: Пример на компонентах, link: /en/, variant: alt }]

  - type: tabs
    id: how
    bg: soft
    variant: top
    align: center
    eyebrow: Как это работает
    title: Один набор данных — три способа работы
    items:
      - label: YAML
        icon: fa6-solid:file-code
        title: Страница как данные
        text: Массив blocks во frontmatter проверяется JSON-схемой, поэтому сломать разметку невозможно.
        image: /img/demo/shot-1.svg
        bullets:
          - Валидация на CI командой <code>validate:blocks</code>
          - Тот же формат читают ИИ-агенты
      - label: Компоненты
        icon: fa6-solid:cubes
        title: Страница как разметка
        text: Те же блоки доступны как глобальные компоненты — без импортов.
        image: /img/demo/shot-2.svg
        bullets:
          - Слоты у каждого блока
          - Свои секции из примитивов
      - label: Своя тема
        icon: fa6-solid:palette
        title: Тема как один CSS-файл
        text: Цветовой и стилевой пресеты независимы и переключаются атрибутами на html.
        image: /img/demo/shot-3.svg
        bullets:
          - Только <code>--ln-*</code> токены
          - Никаких правок в блоках

  - type: stats
    bg: inverse
    cols: 4
    items:
      - { value: '24', label: Блока, text: и 11 примитивов }
      - { value: '8 × 5', label: Комбинаций темы, text: цвет × стиль }
      - { value: '0', label: Зависимостей, text: кроме Vue и VitePress }
      - { value: '100%', label: Типизации, text: 'пропсы, конфиг, блоки' }

  - type: steps
    id: steps-how
    align: center
    eyebrow: Как это работает
    title: Четыре шага до готового сайта
    variant: row
    items:
      - { title: Установить тему, text: Добавьте пакет и укажите его в точке входа темы VitePress. }
      - { title: Собрать страницу, text: Выберите блоки и наполните их текстом — в markdown или в YAML. }
      - { title: Выбрать тему, text: Задайте палитру и стилевой пресет или напишите свой файл переменных. }
      - { title: Опубликовать, text: 'Статика, поиск и SEO-теги генерируются автоматически.' }

  - type: carousel
    bg: soft
    eyebrow: Пресеты
    title: Начните с готовой страницы
    text: Свайп на тач-устройствах, стрелки и точки на десктопе.
    perView: 3
    items:
      - { image: /img/demo/shot-1.svg, badge: Шаблон, title: Пресет 1, text: Карусель на CSS scroll-snap., linkText: Открыть, link: /ru/doc/blocks }
      - { image: /img/demo/shot-2.svg, badge: Пример, title: Пресет 2, text: Работает и без JavaScript., linkText: Открыть, link: /ru/doc/blocks }
      - { image: /img/demo/shot-3.svg, badge: Шаблон, title: Пресет 3, text: Доступна с клавиатуры., linkText: Открыть, link: /ru/doc/blocks }
      - { image: /img/demo/shot-4.svg, badge: Пример, title: Пресет 4, text: Автопрокрутка по желанию., linkText: Открыть, link: /ru/doc/blocks }
      - { image: /img/demo/shot-5.svg, badge: Шаблон, title: Пресет 5, text: Любое число слайдов в ряду., linkText: Открыть, link: /ru/doc/blocks }
      - { image: /img/demo/shot-6.svg, badge: Пример, title: Пресет 6, text: Слот для своей вёрстки слайда., linkText: Открыть, link: /ru/doc/blocks }

  - type: video
    align: center
    eyebrow: Демо
    title: Три минуты про сборку страницы
    text: Плеер не грузится, пока вы не нажмёте play — никаких сторонних кук на первом визите.
    youtube: dQw4w9WgXcQ
    poster: /img/demo/shot-3.svg
    caption: Сборка лендинга с нуля

  - type: testimonials
    align: center
    eyebrow: Отзывы
    title: Что говорят
    cols: 3
    items:
      - text: Мы заменили 900 строк собственного CSS одиннадцатью блоками и файлом токенов. Редизайн занял вечер.
        author: Анна Петрова
        role: Тимлид фронтенда, Globex
        avatar: /img/demo/avatar-1.svg
        rating: 5
      - text: Решил YAML-режим. Контент-команда правит главную, не открывая ни одного Vue-файла.
        author: Марк Иванов
        role: Продакт, Initech
        avatar: /img/demo/avatar-2.svg
        rating: 5
      - text: Документация и лендинг в одном проекте, с одной палитрой. Ровно то, что нужно open-source-проекту.
        author: Лена Сорокина
        role: Мейнтейнер, Umbra
        avatar: /img/demo/avatar-3.svg
        rating: 5

  - type: pricing
    id: pricing
    bg: soft
    align: center
    eyebrow: Тарифы
    title: Простые планы
    text: Тема полностью открыта; платные тарифы здесь только чтобы показать блок.
    note: Цены вымышленные — это демо-страница.
    items:
      - title: Open source
        price: 0 ₽
        period: навсегда
        text: Вся тема целиком, лицензия MIT.
        features: [Все 24 блока, Все пресеты тем, Лендинг + доки + страницы, Поддержка сообщества]
        action: { text: Начать, link: /ru/doc }
      - title: Studio
        price: 1490 ₽
        priceYearly: 14900 ₽
        period: / мес
        periodYearly: / год
        text: Для студий, которые делают сайты клиентам.
        featured: true
        badge: Популярный
        features: [Всё из Open source, Премиум-пресеты блоков, Figma-кит токенов, Приоритет по задачам]
        action: { text: Выбрать Studio, link: '#pricing' }
      - title: Enterprise
        price: По запросу
        text: Интеграция с дизайн-системой и SLA.
        features:
          - Всё из Studio
          - Свои блоки
          - Дизайн-ревью
          - { text: On-prem CMS, included: false }
        action: { text: Связаться, link: /ru/page/links, variant: alt }

  - type: compare
    id: compare
    bg: soft
    align: center
    eyebrow: Сравнение
    title: Что входит в тарифы
    rowsLabel: Возможности
    note: Все тарифы включают исходники и MIT-лицензию.
    columns:
      - { title: Свободно, text: для личных сайтов }
      - { title: Команда, text: до 10 человек, featured: true, badge: Выбор }
      - { title: Компания, text: без ограничений }
    rows:
      - { group: Основное, label: Блоки лендинга, values: ['24', '24', '24'] }
      - { group: Основное, label: Цветовые палитры, values: ['8', '8', 'Свои'] }
      - { group: Основное, label: Стилевые пресеты, values: ['5', '5', 'Свои'] }
      - { group: Поддержка, label: Issues на GitHub, values: [true, true, true] }
      - { group: Поддержка, label: Приватный канал, values: [false, true, true] }
      - { group: Поддержка, label: Помощь с миграцией, values: [false, false, true] }

  - type: gallery
    id: gallery
    eyebrow: Галерея
    title: Экраны шаблона
    cols: 3
    items:
      - { src: /img/demo/shot-1.svg, alt: Экран 1, caption: Галерея — экран 1 }
      - { src: /img/demo/shot-2.svg, alt: Экран 2, caption: Галерея — экран 2 }
      - { src: /img/demo/shot-3.svg, alt: Экран 3, caption: Галерея — экран 3 }
      - { src: /img/demo/shot-4.svg, alt: Экран 4, caption: Галерея — экран 4 }
      - { src: /img/demo/shot-5.svg, alt: Экран 5, caption: Галерея — экран 5 }
      - { src: /img/demo/shot-6.svg, alt: Экран 6, caption: Галерея — экран 6 }

  - type: timeline
    bg: soft
    eyebrow: Дорожная карта
    title: Что дальше
    variant: side
    items:
      - { label: Готово, state: done, title: Библиотека блоков v1, text: 'Двадцать четыре блока, одиннадцать примитивов, две оси темы.' }
      - { label: Готово, state: done, title: Декларативный рендерер, text: Страницы из frontmatter с проверкой по схеме. }
      - { label: В работе, state: active, title: Интеграция с CMS, text: Маппинг типов блоков в админку Decap CMS. }
      - { label: В планах, state: planned, title: Новые блоки, text: 'Таблица сравнения, табы, контактная форма, тизер блога.' }

  - type: team
    align: center
    eyebrow: Команда
    title: Кто делает тему
    cols: 4
    items:
      - name: Иван Козырин
        role: Автор
        avatar: /img/demo/avatar-4.svg
        links: [{ icon: fa6-brands:github, link: 'https://github.com/bozonx' }]
      - { name: Анна Петрова, role: Дизайн, avatar: /img/demo/avatar-1.svg }
      - { name: Марк Иванов, role: Документация, avatar: /img/demo/avatar-2.svg }
      - { name: Лена Сорокина, role: Сообщество, avatar: /img/demo/avatar-3.svg }

  - type: faq
    id: faq
    bg: soft
    eyebrow: FAQ
    title: Частые вопросы
    exclusive: true
    items:
      - question: Документация обязательна?
        answer: Нет. Удалите папку <code>doc/</code> — останется лендинг с дополнительными страницами. Вернуть можно в любой момент.
        open: true
      - question: Можно написать свою тему?
        answer: Да, тема — это CSS-файл. Цветовой пресет задаёт примитивы палитры в <code>[data-theme="id"]</code>, стилевой — форму и плотность в <code>[data-style="id"]</code>. Блоки менять не нужно.
      - question: Можно переопределить один блок?
        answer: У каждого блока есть слоты для его частей, а <code>registerBlockTypes()</code> позволяет подменить блок своим компонентом.
      - question: Работает без JavaScript?
        answer: 'Страница отображается и скроллится: аккордеон, карусель и вся вёрстка — чистый CSS. JS нужен только для анимации появления, переключателей темы и лайтбокса.'
    actions:
      - { text: Читать документацию, link: /ru/doc }

  - type: newsletter
    id: subscribe
    bg: soft
    align: center
    eyebrow: Рассылка
    title: Письмо о новых блоках
    text: Раз в месяц — что появилось в теме и как это использовать.
    action: https://example.com/subscribe
    submitText: Подписаться
    consent: 'Согласен с <a href="page/links">условиями</a>'
    note: Отписаться можно в один клик.

  - type: cta
    variant: banner
    bg: brand
    title: Готовы собрать свой лендинг?
    text: Установите тему, скопируйте эту страницу и замените тексты своими.
    note: Никакой настройки сборки не требуется.
    actions:
      - { text: Начать, link: /ru/doc }
      - { text: Смотреть блоки, link: /ru/doc/blocks, variant: alt }
---
