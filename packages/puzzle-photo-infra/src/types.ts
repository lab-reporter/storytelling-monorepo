export type ShapeType = 'square' | 'horizontalRectangle' | 'verticalRectangle'
export type VariantType = 'line' | 'grid'
export type GridType = 'leftBig' | 'topBig' | 'uniform' | 'mixed'
export type FitModeType = 'width' | 'height'
export type FocusPositionType = 'left' | 'center' | 'right'

export type LayoutProps = {
  photoCount: number
  shape: ShapeType
  hasPadding?: boolean
  isVertical?: boolean // for “line” layouts
  variant?: VariantType // for 3‑ or 4‑photo layouts
  grid?: GridType // for three‑photo ‘grid’ only
  index?: number
}
