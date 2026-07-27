import shared from 'vitepress-theme-neptu-blog/configs/sharedLocalesBase/ru'

export default {
  label: 'Русский',
  themeConfig: {
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Меню',
    darkModeSwitchLabel: 'Тема',
    darkModeSwitchTitle: 'Переключиться на тёмную тему',
    lightModeSwitchTitle: 'Переключиться на светлую тему',
    langMenuLabel: 'Сменить язык',
    docFooter: { prev: 'Предыдущая страница', next: 'Следующая страница' },
    outline: { label: 'На этой странице' },
    lastUpdated: { text: 'Последнее обновление' },
    editLink: { text: 'Редактировать эту страницу на GitHub' },
  },
  t: {
    donate: 'Донат',
    landing: {
      carousel: {
        previous: 'Предыдущий слайд',
        next: 'Следующий слайд',
        region: 'Карусель',
        goTo: 'Перейти к слайду {slide}',
        slideOf: 'Слайд {slide} из {total}',
        pause: 'Остановить показ',
        play: 'Запустить показ',
      },
      pricing: { billingPeriod: 'Период оплаты', monthly: 'Ежемесячно', yearly: 'Ежегодно' },
      gallery: {
        region: 'Просмотр изображений',
        previous: 'Предыдущее изображение',
        next: 'Следующее изображение',
        close: 'Закрыть',
      },
      code: { region: 'Примеры кода', copy: 'Копировать', copied: 'Скопировано' },
      form: {
        email: 'Email',
        placeholder: 'you@example.com',
        submit: 'Подписаться',
        success: 'Спасибо — подтвердите подписку в письме.',
        error: 'Что-то пошло не так. Попробуйте ещё раз.',
      },
      video: { play: 'Смотреть', player: 'Видео' },
      banner: { dismiss: 'Закрыть' },
    },
    ...shared,
  },
  search: {
    options: {
      locales: {
        // don't forget to select while translate
        ru: {
          translations: {
            button: { buttonText: 'Искать', buttonAriaLabel: 'Искать' },
            modal: {
              noResultsText: 'Ничего не найдено',
              resetButtonTitle: 'Стереть',
              displayDetails: 'Больше деталей',
              backButtonTitle: 'Закрыть поиск',
              footer: {
                selectText: 'Выбрать',
                selectKeyAriaLabel: 'Кнопка ввод',
                navigateText: 'Навигация',
                navigateUpKeyAriaLabel: 'Стрелка вверх',
                navigateDownKeyAriaLabel: 'Стрелка вниз',
                closeText: 'Закрыть',
                closeKeyAriaLabel: 'Кнопка escape',
              },
            },
          },
        },
      },
    },
  },
}
