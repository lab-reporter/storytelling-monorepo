import React, { useState } from 'react'
import styled from 'styled-components'
import { AtomicBlockProps } from '../block-renderer-fn.type'
import { BlockquoteInput, BlockquoteInputValue } from '../buttons/blockquote'
import { EditButton, EditableBlock as _EditableBlock } from './styled'
import { blockRenderers } from '@stroy-telling-reporter/draft-renderer'

const { BlockquoteInArticleBody } = blockRenderers

const StyledBlockquote = styled(BlockquoteInArticleBody)``

const EditableBlock = styled(_EditableBlock)`
  &:hover {
    ${StyledBlockquote} {
      background-color: #f0f0f0;
      opacity: 0.3;
    }
`

export function EditableBlockquote(
  props: AtomicBlockProps<BlockquoteInputValue>
) {
  const [isInputOpen, setIsInputOpen] = useState(false)
  const { block, blockProps, contentState } = props
  const { onEditStart, onEditFinish } = blockProps
  const entityKey = block.getEntityAt(0)
  const entity = contentState.getEntity(entityKey)
  const data = entity.getData()

  const onInputChange = (inputValue: BlockquoteInputValue) => {
    // close `BlockquoteInput`
    setIsInputOpen(false)

    onEditFinish({
      entityKey,
      entityData: inputValue,
    })
  }

  return (
    <React.Fragment>
      <BlockquoteInput
        isOpen={isInputOpen}
        onCancel={() => {
          setIsInputOpen(false)
          onEditFinish()
        }}
        onConfirm={onInputChange}
        inputValue={data}
      />
      <EditableBlock>
        <StyledBlockquote data={data} />
        <EditButton
          onClick={() => {
            // call `onEditStart` prop as we are trying to update the blockquote entity
            onEditStart()
            // open `BlockquoteInput`
            setIsInputOpen(true)
          }}
        >
          <i className="fa-solid fa-pen"></i>
          <span>Modify</span>
        </EditButton>
      </EditableBlock>
    </React.Fragment>
  )
}
