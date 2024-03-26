import { readOnlyAnnotationDecorator } from './read-only-annotation'
import { readOnlyLinkDecorator } from './read-only-link'
import { editableAnnotationDecorator } from './editable-annotation'
import { editableLinkDecorator } from './editable-link'

export const readOnlyDecorators = {
  link: readOnlyLinkDecorator,
  annotation: readOnlyAnnotationDecorator,
}

export const editableDecorators = {
  link: editableLinkDecorator,
  annotation: editableAnnotationDecorator,
}
