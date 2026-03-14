import styled from 'styled-components'

export const Panel = styled.div<{ $fullScreen: boolean }>`
  position: relative;
  height: 400px;
  background-color: #fafbfc;
  border-radius: 12px;
  zindex: 30;

  ${({ $fullScreen }) => {
    if ($fullScreen) {
      return `
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 0;
      `
    }
  }}
`
