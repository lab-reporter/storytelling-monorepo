import React, { useState } from 'react'
import styled from 'styled-components'
import { AtomicBlockProps } from '../block-renderer-fn.type'
import {
  EmbeddedCodeInput,
  EmbeddedCodeInputValue,
} from '../buttons/embedded-code'
import { EditableBlock } from './styled'
import { TextArea } from '@keystone-ui/fields'

function EmbeddedCode({
  className,
  embeddedCode,
}: {
  className?: string
  embeddedCode: string
}) {
  return (
    <div className={className}>
      <span>Embedded Code:</span>
      <TextArea disabled type="text" value={embeddedCode}></TextArea>
    </div>
  )
}

const StyledEmbeddedCode = styled(EmbeddedCode)`
  max-width: 700px;
  margin: 0 auto 30px auto;
  background-color: #fafbfc;
`

export function EditableEmbeddedCode(
  props: AtomicBlockProps<EmbeddedCodeInputValue>
) {
  const [isInputOpen, setIsInputOpen] = useState(false)
  const { block, blockProps, contentState } = props
  const { onEditStart, onEditFinish } = blockProps
  const entityKey = block.getEntityAt(0)
  const entity = contentState.getEntity(entityKey)
  const data = entity.getData()

  const onInputChange = (inputValue: EmbeddedCodeInputValue) => {
    // close `EmbeddedCodeInput`
    setIsInputOpen(false)

    onEditFinish({
      entityKey,
      entityData: inputValue,
    })
  }

  return (
    <React.Fragment>
      <EmbeddedCodeInput
        isOpen={isInputOpen}
        onCancel={() => {
          setIsInputOpen(false)
          onEditFinish()
        }}
        onConfirm={onInputChange}
        inputValue={data}
      />
      <EditableBlock
        onClick={() => {
          onEditStart()
          setIsInputOpen(true)
        }}
      >
        <StyledEmbeddedCode embeddedCode={data?.embeddedCode} />
      </EditableBlock>
    </React.Fragment>
  )
}
