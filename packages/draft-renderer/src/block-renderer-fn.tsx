import { ContentState, ContentBlock } from 'draft-js'
import { blockRenderers } from './block-renderers'
const {
  BlockquoteInArticleBody,
  Divider,
  EmbeddedCodeInArticleBody,
  ImageInArticleBody,
  InfoBoxInArticleBody,
  SlideshowInArticleBody,
  NewsReading,
} = blockRenderers

const AtomicBlock = (props: {
  contentState: ContentState
  block: ContentBlock
}) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))

  const entityType = entity.getType()
  const entityData = entity.getData()

  switch (entityType) {
    case 'BLOCKQUOTE': {
      return BlockquoteInArticleBody({ data: entityData })
    }
    case 'DIVIDER': {
      return Divider()
    }
    case 'IMAGE': {
      return ImageInArticleBody({ data: entityData })
    }
    case 'SLIDESHOW': {
      return SlideshowInArticleBody({ data: entityData })
    }
    case 'EMBEDDEDCODE': {
      return EmbeddedCodeInArticleBody({ data: entityData })
    }
    case 'INFOBOX': {
      return InfoBoxInArticleBody({ data: entityData })
    }
    case 'NEWS_READING': {
      return NewsReading({ data: entityData })
    }
  }
  return null
}

export function atomicBlockRenderer(block: ContentBlock) {
  if (block.getType() === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
    }
  }

  return null
}
