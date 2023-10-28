import styled from 'styled-components'

export const EditButton = styled.div`
  cursor: pointer;
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const EditableBlock = styled.div`
  position: relative;

  &:hover {
    ${EditButton} {
      opacity: 1;
      display: block;
    }
  }
`
