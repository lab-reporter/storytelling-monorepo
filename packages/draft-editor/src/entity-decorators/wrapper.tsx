import React, { ReactNode } from 'react'
import styled from 'styled-components'

const Wrapper = styled.span`
  display: inline;
  color: #8e8e8e;
`

const EditButton = styled.div`
  display: inline;
  cursor: pointer;
  padding-left: 2px;
  padding-right: 2px;
`

export const EditableWrapper = (props: {
  component: ReactNode
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <Wrapper>
      {props.component}
      <EditButton onClick={props.onClick}>
        <i className="fas fa-pen"></i>
      </EditButton>
    </Wrapper>
  )
}
