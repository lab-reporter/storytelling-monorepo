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

const Container = styled.div`
  position: relative;

  &:hover {
    ${EditButton} {
      opacity: 1;
      display: block;
    }

    & > :not(${EditButton}) {
      opacity: 0.3;
      background-color: #f0f0f0;
    }
  }
`

export const EditableBlock = (props: {
  className?: string
  children: ReactNode
  onClick: () => void
}) => {
  return (
    <Container className={props?.className}>
      {props.children}
      <EditButton onClick={props.onClick}>
        <i className="fa-solid fa-pen"></i>
        <span>Modify</span>
      </EditButton>
    </Container>
  )
}
