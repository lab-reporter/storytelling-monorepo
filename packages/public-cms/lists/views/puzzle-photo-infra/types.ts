// type Shape = 'square' | 'horizontalRectangle' | 'verticalRectangle'
// type Direction = 'horizontal' | 'vertical'
export type Photo = {
  url: string
  fitMode: 'width' | 'height'
  focusPosition: 'left' | 'center' | 'right'
}
export type LayoutProps = {
  layout: LayoutOption
  photoCount: number
  hasPadding?: boolean
  variant?: 'line' | 'grid'
  grid?: 'leftBig' | 'topBig' | 'uniform' | 'mixed'
  isVertical?: boolean
}
export type PuzzlePhotoConfig = LayoutProps & {
  photos: Photo[]
}

export type LayoutOption =
  | '1A'
  | '1B'
  | '2A'
  | '2B'
  | '3A'
  | '3B'
  | '3C'
  | '3D'
  | '4A'
  | '4B'
  | '4C'

export const layoutOptions: LayoutOption[] = [
  '1A',
  '1B',
  '2A',
  '2B',
  '3A',
  '3B',
  '3C',
  '3D',
  '4A',
  '4B',
  '4C',
]

export type PickerSetting = {
  cols: string
  rows: string
  inset?: number
  cells: { col: string; row: string }[]
}

const inset = 10

export const layoutSettings: Record<
  LayoutOption,
  { pickerSetting: PickerSetting; props: LayoutProps }
> = {
  '1A': {
    pickerSetting: {
      cols: '1fr',
      rows: '1fr',
      cells: [{ col: '1 / 2', row: '1 / 2' }],
    },
    props: {
      layout: '1A',
      photoCount: 1,
      hasPadding: false,
      isVertical: false,
      variant: undefined,
      grid: undefined,
    },
  },
  '1B': {
    pickerSetting: {
      cols: '1fr',
      rows: '1fr',
      inset: inset,
      cells: [{ col: '1 / 2', row: '1 / 2' }],
    },
    props: {
      layout: '1B',
      photoCount: 1,
      hasPadding: true,
      isVertical: false,
      variant: undefined,
      grid: undefined,
    },
  },
  '2A': {
    pickerSetting: {
      cols: '1fr',
      rows: '1fr 1fr',
      cells: [
        { col: '1 / 2', row: '1 / 2' },
        { col: '1 / 2', row: '2 / 3' },
      ],
      inset: inset,
    },
    props: {
      layout: '2A',
      photoCount: 2,
      hasPadding: undefined,
      isVertical: true,
      variant: undefined,
      grid: undefined,
    },
  },
  '2B': {
    pickerSetting: {
      cols: '1fr 1fr',
      rows: '1fr',
      cells: [
        { col: '1 / 2', row: '1 / 2' },
        { col: '2 / 3', row: '1 / 2' },
      ],
      inset: inset,
    },
    props: {
      layout: '2B',
      photoCount: 2,
      hasPadding: undefined,
      isVertical: false,
      variant: undefined,
      grid: undefined,
    },
  },
  '3A': {
    pickerSetting: {
      cols: '1fr',
      rows: '1fr 1fr 1fr',
      cells: [
        { col: '1 / 2', row: '1 / 2' },
        { col: '1 / 2', row: '2 / 3' },
        { col: '1 / 2', row: '3 / 4' },
      ],
      inset: inset,
    },
    props: {
      layout: '3A',
      photoCount: 3,
      hasPadding: undefined,
      isVertical: true,
      variant: 'line',
      grid: undefined,
    },
  },
  '3B': {
    pickerSetting: {
      cols: '1fr 1fr 1fr',
      rows: '1fr',
      cells: [
        { col: '1 / 2', row: '1 / 2' },
        { col: '2 / 3', row: '1 / 2' },
        { col: '3 / 4', row: '1 / 2' },
      ],
      inset: inset,
    },
    props: {
      layout: '3B',
      photoCount: 3,
      hasPadding: undefined,
      isVertical: false,
      variant: 'line',
      grid: undefined,
    },
  },
  '3C': {
    pickerSetting: {
      cols: '1fr 1fr',
      rows: '1fr 1fr',
      cells: [
        { col: '1 / 2', row: '1 / 3' },
        { col: '2 / 3', row: '1 / 2' },
        { col: '2 / 3', row: '2 / 3' },
      ],
      inset: inset,
    },
    props: {
      layout: '3C',
      photoCount: 3,
      hasPadding: undefined,
      isVertical: true,
      variant: 'grid',
      grid: 'leftBig',
    },
  },
  '3D': {
    pickerSetting: {
      cols: '1fr 1fr',
      rows: '1fr 1fr',
      cells: [
        { col: '1 / 3', row: '1 / 2' },
        { col: '1 / 2', row: '2 / 3' },
        { col: '2 / 3', row: '2 / 3' },
      ],
      inset: inset,
    },
    props: {
      layout: '3D',
      photoCount: 3,
      hasPadding: undefined,
      isVertical: undefined,
      variant: 'grid',
      grid: 'topBig',
    },
  },
  '4A': {
    pickerSetting: {
      cols: '1fr 1fr',
      rows: '1fr 1fr 1fr 1fr 1fr 1fr',
      cells: [
        { col: '1 / 2', row: '2 / 4' },
        { col: '2 / 3', row: '2 / 4' },
        { col: '1 / 2', row: '4 / 6' },
        { col: '2 / 3', row: '4 / 6' },
      ],
      inset: inset,
    },
    props: {
      layout: '4A',
      photoCount: 4,
      hasPadding: undefined,
      isVertical: false,
      variant: 'grid',
      grid: 'uniform',
    },
  },
  '4B': {
    pickerSetting: {
      cols: '1fr 1fr 1fr 1fr 1fr 1fr',
      rows: '1fr 1fr',
      cells: [
        { col: '2 / 4', row: '1 / 2' },
        { col: '4 / 6', row: '1 / 2' },
        { col: '2 / 4', row: '2 / 3' },
        { col: '4 / 6', row: '2 / 3' },
      ],
      inset: inset,
    },
    props: {
      layout: '4B',
      photoCount: 4,
      hasPadding: undefined,
      isVertical: true,
      variant: 'grid',
      grid: 'uniform',
    },
  },
  '4C': {
    pickerSetting: {
      cols: '1fr 1fr 1fr',
      rows: '1fr 1fr',
      cells: [
        { col: '1 / 3', row: '1 / 2' },
        { col: '3 / 4', row: '1 / 2' },
        { col: '1 / 2', row: '2 / 3' },
        { col: '2 / 4', row: '2 / 3' },
      ],
      inset: inset,
    },
    props: {
      layout: '4C',
      photoCount: 4,
      hasPadding: undefined,
      isVertical: undefined,
      variant: 'grid',
      grid: 'mixed',
    },
  },
}
