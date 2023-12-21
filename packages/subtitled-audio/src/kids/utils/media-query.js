export const breakpoints = {
  small: 320,
  medium: 760,
  large: 1440,
}

export const mediaQuery = {
  smallOnly: `@media (max-width: ${breakpoints.medium - 1}px)`,
  mediumOnly: `@media (min-width: ${breakpoints.medium}px) and (max-width: ${
    breakpoints.large - 1
  }px)`,
  mediumAbove: `@media (min-width: ${breakpoints.medium}px)`,
  largeBelow: `@media (max-width: ${breakpoints.large - 1}px)`,
  largeOnly: `@media (min-width: ${breakpoints.large}px)`,
}

export default { breakpoints, mediaQuery }
