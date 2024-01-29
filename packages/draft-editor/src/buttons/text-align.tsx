import React from 'react'
import { EditorState, Modifier } from 'draft-js'
import * as Immutable from 'immutable'

export const TextAlignPropertyName = 'textAlign'

export enum TextAlignEnum {
  RIGHT = 'right',
  CENTER = 'center',
}

const toggleTextAlignOfSelectionBlocks = (
  editorState: EditorState,
  textAlignValue: TextAlignEnum
) => {
  return setSelectionBlockData(
    editorState,
    Immutable.Map({
      [TextAlignPropertyName]:
        getTextAlignOfSelectionBlocks(editorState) !== textAlignValue
          ? textAlignValue
          : undefined,
    })
  )
}

const setSelectionBlockData = (
  editorState: EditorState,
  blockData: Immutable.Map<any, any>
) => {
  return Modifier.mergeBlockData(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    blockData
  )
}

export const getTextAlignOfSelectionBlocks = (editorState: EditorState) => {
  const block = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getAnchorKey())
  const blockData = block.getData()
  return blockData.get(TextAlignPropertyName)
}

export function TextAlignRightButton(props: {
  className?: string
  editorState: EditorState
  onChange: (arg0: EditorState) => void
}) {
  const { editorState, onChange } = props

  return (
    <React.Fragment>
      <div
        className={props.className}
        onMouseDown={() => {
          const newContentState = toggleTextAlignOfSelectionBlocks(
            editorState,
            TextAlignEnum.RIGHT
          )
          onChange(
            EditorState.push(editorState, newContentState, 'change-block-data')
          )
        }}
      >
        <i className="fa-solid fa-align-right"></i>
      </div>
    </React.Fragment>
  )
}

export function TextAlignCenterButton(props: {
  className?: string
  editorState: EditorState
  onChange: (arg0: EditorState) => void
}) {
  const { editorState, onChange } = props

  return (
    <React.Fragment>
      <div
        className={props.className}
        onMouseDown={() => {
          const newContentState = toggleTextAlignOfSelectionBlocks(
            editorState,
            TextAlignEnum.CENTER
          )
          onChange(
            EditorState.push(editorState, newContentState, 'change-block-data')
          )
        }}
      >
        <i className="fa-solid fa-align-center"></i>
      </div>
    </React.Fragment>
  )
}
