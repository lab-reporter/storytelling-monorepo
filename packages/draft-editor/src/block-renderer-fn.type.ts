import { ContentBlock, ContentState, DraftDecoratorType } from 'draft-js'
import { RichTextEditorComponent } from './draft-editor.type'

export type AtomicBlockProps<T> = {
  block: ContentBlock
  blockProps: {
    onEditStart: () => void
    onEditFinish: (arg0?: { entityKey?: string; entityData?: T }) => void
    RichTextEditorComponent: RichTextEditorComponent
    decorator: DraftDecoratorType
  }
  contentState: ContentState
}
