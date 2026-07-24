import shared from 'vitepress-theme-neptu-blog/configs/sharedLocalesBase/en'

export default {
  label: 'English',
  themeConfig: {
    returnToTopLabel: 'Return to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Appearance',
    darkModeSwitchTitle: 'Switch to dark theme',
    lightModeSwitchTitle: 'Switch to light theme',
    langMenuLabel: 'Change language',
    docFooter: { prev: 'Previous page', next: 'Next page' },
    outline: { label: 'On this page' },
    lastUpdated: { text: 'Updated at' },
    editLink: { text: 'Edit this page on GitHub' },
  },
  t: {
    donate: 'Donate',
    ...shared,
  },
  search: {
    options: {
      locales: {
        // don't forget to select while translate
        en: {
          translations: {
            button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
            modal: {
              noResultsText: 'No results for',
              resetButtonTitle: 'Reset search',
              displayDetails: 'Display detailed list',
              backButtonTitle: 'Close search',
              footer: {
                selectText: 'to select',
                selectKeyAriaLabel: 'enter',
                navigateText: 'to navigate',
                navigateUpKeyAriaLabel: 'up arrow',
                navigateDownKeyAriaLabel: 'down arrow',
                closeText: 'to close',
                closeKeyAriaLabel: 'escape',
              },
            },
          },
        },
      },
    },
  },
}
