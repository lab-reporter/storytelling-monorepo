import { createGlobalStyle } from 'styled-components'

export const ZoomGlobalStyle = createGlobalStyle`
[id^='puzzle-photo-'] .medium-zoom-overlay,
[id^='puzzle-photo-'] .medium-zoom-image--opened {
  max-width: 100% !important;
  max-height: 100% !important;
}
`
