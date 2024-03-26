import React, { ReactNode } from 'react'
import styled from 'styled-components'

const EditButton = styled.div`
  cursor: pointer;
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const _EditableBlock = styled.div`
  position: relative;

  &:hover {
    ${EditButton} {
      opacity: 1;
      display: block;
    }
  }
`

export const EditableBlock = (props: {
  component: ReactNode
  onClick: () => void
}) => {
  return (
    <_EditableBlock>
      {props.component}
      <EditButton onClick={props.onClick}>
        <i className="fa-solid fa-pen"></i>
        <span>Modify</span>
      </EditButton>
    </_EditableBlock>
  )
}
