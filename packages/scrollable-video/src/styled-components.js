//  `styled-componenets@5.x` (the version we use)
//  does not support ESM (ES6 Module).
//  Therefore, we need to import `styled-components` and export
//  it again to workaround the issues.

import styled from 'styled-components'
export { ThemeProvider, keyframes, css } from 'styled-components'

export default styled.default || styled
