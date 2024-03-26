import { ContentBlock, ContentState } from 'draft-js'

export type AtomicBlockProps<T> = {
  block: ContentBlock
  blockProps: {
    onEditStart: () => void
    onEditFinish: (arg0?: { entityKey?: string; entityData?: T }) => void
  }
  contentState: ContentState
}
