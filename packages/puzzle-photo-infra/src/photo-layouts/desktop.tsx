import type { LayoutProps } from '../types'

export function square(p: LayoutProps) {
  const { photoCount, isVertical, variant, grid, index } = p
  if (photoCount == 1) {
    return `width: 100%; height: 100%;`
  }
  if (photoCount === 2) {
    return isVertical
      ? `height: calc((100vh - 150px) / 2); aspect-ratio: 3/2;`
      : `width: calc((100vh - 150px) / 2); aspect-ratio: 2/3;`
  }
  if (photoCount === 3 && variant === 'line') {
    return isVertical
      ? `height: calc((100vh - 120px) / 3); aspect-ratio:3/2;`
      : `width: calc((100vh - 120px) / 3); aspect-ratio:2/3;`
  }
  if (grid === 'leftBig') {
    return index == 0
      ? `height: calc((100vh - 130px) / 3 * 2 + 30px); aspect-ratio: 2/3;`
      : `width: calc((100vh - 130px) / 2); aspect-ratio: 3/2;`
  }
  if (grid === 'topBig') {
    return index == 0
      ? `width: calc((100vh - 100px) / 3 * 2 + 30px); aspect-ratio: 3/2;`
      : `height: calc((100vh - 100px) / 2); aspect-ratio: 2/3;`
  }
  if (grid === 'uniform') {
    return isVertical
      ? `height: calc((100vh - 90px) / 2); aspect-ratio: 2/3;`
      : `width: calc((100vh - 90px) / 2); aspect-ratio: 3/2;`
  }
  if (grid === 'mixed' && index != null) {
    return index % 3 === 0
      ? `height: calc((100vh - 150px) / 2); aspect-ratio: 3/2;`
      : `height: calc((100vh - 150px) / 2); aspect-ratio: 2/3;`
  }
  return `width:100%; height:100%;`
}

export function horizRect(p: LayoutProps) {
  const { photoCount, hasPadding, isVertical, variant, grid, index } = p
  if (photoCount === 1) {
    return hasPadding
      ? `height: calc(100vw / 3 * 2 - 100px); aspect-ratio: 3 / 2`
      : `width: 100%; height: 100%`
  }
  if (photoCount === 2) {
    return isVertical
      ? `height: calc((100vw / 3 * 2 - 150px) / 2); aspect-ratio: 3/2;`
      : `width: calc(((100vw / 3 * 2) - 100px) / 3 * 2); aspect-ratio: 2/3;`
  }
  if (photoCount === 3 && variant === 'line') {
    return isVertical
      ? `height: calc(((100vw / 3 * 2) - 120px) / 3); aspect-ratio: 3/2;`
      : `width: calc((100vw - 120px) / 3); aspect-ratio: 2/3;`
  }
  if (grid === 'leftBig') {
    return index == 0
      ? `height: calc(100vw / 3 * 2 - 100px); aspect-ratio: 2/3;`
      : `height: calc((100vw / 3 * 2 - 130px) / 2 ); aspect-ratio: 3/2;`
  }
  if (grid === 'topBig') {
    return index == 0
      ? `width: calc((100vw / 3 * 2 - 100px) / 3 * 2 + 30px); aspect-ratio: 3/2;`
      : `height: calc((100vw / 3 * 2 - 100px) / 2); aspect-ratio: 2/3;`
  }
  if (grid === 'uniform') {
    return isVertical
      ? `height: calc((100vw / 3 * 2 - 90px) / 2); aspect-ratio: 2/3;`
      : `height: calc((100vw / 3 * 2 - 90px) / 2); aspect-ratio: 3/2;`
  }
  if (grid === 'mixed' && index != null) {
    return index % 3 === 0
      ? `height: calc((100vw / 3 * 2 - 150px) / 2); aspect-ratio: 3/2;`
      : `height: calc((100vw / 3 * 2 - 150px) / 2); aspect-ratio: 2/3;`
  }
  return `width:100%; height:100%;`
}

export function vertRect(p: LayoutProps) {
  const { photoCount, hasPadding, isVertical, variant, grid, index } = p
  if (photoCount === 1) {
    return hasPadding
      ? `width: calc(100vh / 3 * 2 - 100px); aspect-ratio: 2 / 3`
      : `width: 100%; height: 100%`
  }
  if (photoCount === 2) {
    return isVertical
      ? `height: calc((100vh - 150px) / 2); aspect-ratio: 3/2;`
      : `width: calc(((100vh / 3 * 2) - 60px) / 2); aspect-ratio: 2/3;`
  }
  if (photoCount === 3 && variant === 'line') {
    return isVertical
      ? `height: calc((100vh - 120px) / 3); aspect-ratio: 3/2;`
      : `width: calc(((100vh / 3 * 2) - 120px) / 3); aspect-ratio: 2/3;`
  }
  if (grid === 'leftBig') {
    return index == 0
      ? `height: calc((100vh / 3 * 2 - 90px) / 3 * 2 + 30px ); aspect-ratio: 2/3;`
      : `width: calc((100vh / 3 * 2 - 90px) / 2 ); aspect-ratio: 3/2;`
  }
  if (grid === 'topBig') {
    return index == 0
      ? `width: calc(100vh / 3 * 2 - 60px) ; aspect-ratio: 3/2;`
      : `width: calc((100vh / 3 * 2 - 90px) / 2); aspect-ratio: 2/3;`
  }
  if (grid === 'uniform') {
    return isVertical
      ? `width: calc((100vh / 3 * 2 - 90px) / 2); aspect-ratio: 2/3;`
      : `width: calc((100vh / 3 * 2 - 90px) / 2); aspect-ratio: 3/2;`
  }
  if (grid === 'mixed' && index != null) {
    return index % 3 === 0
      ? `width: calc(100vh / 3 * 1.3); aspect-ratio: 3/2;`
      : `height: calc(100vh / 9 * 2.6); aspect-ratio: 2/3;`
  }
  return `width:100%; height:100%;`
}
