import React from 'react'
import {
  RichTextEditor as _RichTextEditor,
  RichTextEditorWithoutDecoratorProps,
} from './rich-text-editor'
import buttonNames from './buttons/bt-names'
import { editableDecorators } from './entity-decorators/index'

const RichTextEditor = (props: RichTextEditorWithoutDecoratorProps) => {
  return (
    <_RichTextEditor
      decorators={[editableDecorators.annotation, editableDecorators.link]}
      {...props}
    />
  )
}

export { RichTextEditor, buttonNames }

export default {
  RichTextEditor,
  buttonNames,
}
