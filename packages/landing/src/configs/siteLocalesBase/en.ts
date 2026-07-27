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
    landing: {
      carousel: {
        previous: 'Previous slide',
        next: 'Next slide',
        region: 'Carousel',
        goTo: 'Go to slide {slide}',
        slideOf: 'Slide {slide} of {total}',
        pause: 'Pause the slideshow',
        play: 'Start the slideshow',
      },
      pricing: { billingPeriod: 'Billing period', monthly: 'Monthly', yearly: 'Yearly' },
      gallery: {
        region: 'Image viewer',
        previous: 'Previous image',
        next: 'Next image',
        close: 'Close',
      },
      code: { region: 'Code samples', copy: 'Copy', copied: 'Copied' },
      form: {
        email: 'Email',
        placeholder: 'you@example.com',
        submit: 'Subscribe',
        success: 'Thanks — check your inbox to confirm.',
        error: 'Something went wrong. Please try again.',
      },
      video: { play: 'Play', player: 'Video' },
      banner: { dismiss: 'Dismiss' },
    },
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
