import React from 'react'
import styled, { css } from 'styled-components'
import { EditorState } from 'draft-js'

export const buttonStyle = css<{
  isDisabled: boolean
  readOnly: boolean
  isActive?: boolean
}>`
  cursor: pointer;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;
  padding: 0 12px;
  margin: ${(props) => (props.isDisabled ? '0' : '0 0 10px 0')};
  background-color: #fff;
  border: solid 1px rgb(193, 199, 208);
  align-items: center;
  height: 40px;

  cursor: ${(props) => (props.readOnly ? 'not-allowed' : 'pointer')};
  color: ${(props) => {
    if (props.readOnly) {
      return '#c1c7d0'
    }
    if (props.isActive) {
      return '#3b82f6'
    }
    return '#6b7280'
  }};
  border: solid 1px
    ${(props) => {
      if (props.readOnly) {
        return '#c1c7d0'
      }
      if (props.isActive) {
        return '#3b82f6'
      }
      return '#6b7280'
    }};
  box-shadow: ${(props) => {
    if (props.readOnly) {
      return 'unset'
    }
    if (props.isActive) {
      return 'rgba(38, 132, 255, 20%)  0px 1px 4px '
    }
    return 'unset'
  }};
  transition: box-shadow 100ms linear;

  display: ${(props) => {
    if (props.isDisabled) {
      return 'none'
    }
    return 'inline-flex'
  }};
`

const CustomButton = styled.div`
  ${buttonStyle}
`

type StyleButtonProps = {
  active: boolean
  label: string
  onToggle: (arg0: string) => void
  style: string
  icon: string
  readOnly: boolean
  isDisabled: boolean
}

class StyleButton extends React.Component<StyleButtonProps> {
  onToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    this.props.onToggle(this.props.style)
  }

  render() {
    return (
      <CustomButton
        isDisabled={this.props.isDisabled}
        isActive={this.props.active}
        onMouseDown={this.onToggle}
        readOnly={this.props.readOnly}
      >
        {this.props.icon && <i className={this.props.icon}></i>}
        <span>{!this.props.icon ? this.props.label : ''}</span>
      </CustomButton>
    )
  }
}

type StyleControlsProps = {
  editorState: EditorState
  disabledButtons: string[]
  onToggle: (buttonName: string) => void
  readOnly: boolean
}

const blockStyles = [
  { label: 'H2', style: 'header-two', icon: '' },
  { label: 'H3', style: 'header-three', icon: '' },
  { label: 'H4', style: 'header-four', icon: '' },
  { label: 'H5', style: 'header-five', icon: '' },
  { label: 'UL', style: 'unordered-list-item', icon: 'fas fa-list-ul' },
  { label: 'OL', style: 'ordered-list-item', icon: 'fas fa-list-ol' },
  { label: 'Quote', style: 'blockquote', icon: 'fas fa-quote-left' },
]

export const BlockStyleControls = (props: StyleControlsProps) => {
  const { editorState, disabledButtons } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()
  return (
    <React.Fragment>
      {blockStyles.map((type) => (
        <StyleButton
          isDisabled={disabledButtons.includes(type.style)}
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          icon={type.icon}
          readOnly={props.readOnly}
        />
      ))}
    </React.Fragment>
  )
}

const inlineStyles = [
  { label: 'Bold', style: 'BOLD', icon: 'fas fa-bold' },
  { label: 'Italic', style: 'ITALIC', icon: 'fas fa-italic' },
  { label: 'Underline', style: 'UNDERLINE', icon: 'fas fa-underline' },
  { label: 'Monospace', style: 'CODE', icon: 'fas fa-terminal' },
]

export const InlineStyleControls = (props: StyleControlsProps) => {
  const currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <React.Fragment>
      {inlineStyles.map((type) => (
        <StyleButton
          isDisabled={props.disabledButtons.includes(type.style.toLowerCase())}
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          icon={type.icon}
          readOnly={props.readOnly}
        />
      ))}
    </React.Fragment>
  )
}
