import { RawDraftContentState } from 'draft-js'
import { Vector3, Quaternion } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

export enum WidthEnum {
  WIDE = 'wide',
  NARROW = 'narrow',
}

export enum AlignmentEnum {
  RIGHT = 'right',
  LEFT = 'left',
  CENTER = 'center',
}

export enum ThemeEnum {
  DARK_MODE = 'dark_mode',
  LIGHT_MODE = 'light_mode',
}

export type CaptionProp = {
  rawContentState: RawDraftContentState
  alignment?: AlignmentEnum
  width?: WidthEnum
  top?: number
  customCss?: string
}

export type CameraData = {
  pois?: POI[]
  animationClip?: Record<string, unknown>
}

export type POI = {
  position: number[]
  quaternion: number[]
  duration: number
  ease: string
  image?: string
  caption: CaptionProp
}

export type ThreePOI = {
  position: Vector3
  quaternion: Quaternion
  duration: number
  ease: string
  image?: string
  caption: CaptionProp
}

export type GTLFModelObject = {
  url: string
  data?: GLTF
  userData?: Record<string, unknown>
}

export type { GLTF }
