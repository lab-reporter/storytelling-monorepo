//  `styled-componenets@5.x` (the version we use)
//  does not support ESM (ES6 Module).
//  Therefore, we need to import `styled-components` and export
//  it again to workaround the issues.

import styled, { StyledInterface } from 'styled-components'
export { ThemeProvider, keyframes, css } from 'styled-components'

// @ts-ignore @types/styled-components does not define `default` property.
// But in the esm file `styled-components/dist/styled-components.esm.js`, `default` property exists.
export default (styled.default as StyledInterface) || styled
