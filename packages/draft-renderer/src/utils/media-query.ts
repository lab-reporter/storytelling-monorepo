const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  hd: 1440,
}

const mediaQuery = {
  mobileOnly: `@media (max-width: ${breakpoints.tablet - 1}px)`,
  tabletOnly: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${
    breakpoints.desktop - 1
  }px)`,
  tabletAbove: `@media (min-width: ${breakpoints.tablet}px)`,
  desktopBelow: `@media (max-width: ${breakpoints.desktop - 1}px)`,
  desktopOnly: `@media (min-width: ${breakpoints.desktop}px) and (max-width: ${
    breakpoints.hd - 1
  }px)`,
  desktopAbove: `@media (min-width: ${breakpoints.desktop}px)`,
  hdBelow: `@media (max-width: ${breakpoints.hd - 1}px)`,
  hdOnly: `@media (min-width: ${breakpoints.hd}px)`,
}

export { breakpoints, mediaQuery }
