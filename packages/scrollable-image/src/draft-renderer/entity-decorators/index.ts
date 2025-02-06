import { CompositeDecorator } from 'draft-js'
import { annotationDecorator } from './annotation-decorator'
import { linkDecorator } from './link-decorator'

export { annotationDecorator, linkDecorator }

export const decorator = new CompositeDecorator([
  annotationDecorator,
  linkDecorator,
])
