import type { Klass, LexicalNode } from 'lexical'
import { AutoLinkNode, LinkNode } from '@lexical/link'

export const lexicalNodes: Array<Klass<LexicalNode>> = [AutoLinkNode, LinkNode]
