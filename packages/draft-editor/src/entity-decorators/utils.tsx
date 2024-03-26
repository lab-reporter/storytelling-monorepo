import { ContentBlock, ContentState } from 'draft-js'
import { Entity } from '../constants'

export const findEntitiesByType = (type: Entity) => {
  return (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
  ) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === type
      )
    }, callback)
  }
}
