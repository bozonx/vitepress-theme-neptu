import shared from 'vitepress-theme-neptu/configs/sharedLocalesBase/en'

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
}
