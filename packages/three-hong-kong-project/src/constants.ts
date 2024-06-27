import { resourcesHostedAt } from './environment-variables'

const urlPrefix =
  {
    localhost: '.',
    github:
      'https://raw.githubusercontent.com/nickhsine/story-telling-monorepo/main/packages/three-hong-kong-project/dev',
    unpkg:
      'https://unpkg.com/@story-telling-reporter/react-three-hong-kong-project/dev',
    gcs: 'https://story-telling-storage.twreporter.org/projects/three-hong-kong-project',
  }[resourcesHostedAt] ?? '.'

const imgsForEachComponent = [
  [`${urlPrefix}/public/mobile-scene.png`], // mobile.tsx
  [
    `${urlPrefix}/blow-up-font/title-mobile.svg`,
    `${urlPrefix}/blow-up-font/mobile-font.webp`,
    `${urlPrefix}/blow-up-font/img-1.webp`,
    `${urlPrefix}/blow-up-font/img-2.webp`,
    `${urlPrefix}/blow-up-font/img-3.webp`,
    `${urlPrefix}/blow-up-font/title.svg`,
  ], // blow-up.tsx
  [
    `${urlPrefix}/lee-hon-kong-kai-font/title-mobile.svg`,
    `${urlPrefix}/lee-hon-kong-kai-font/mobile-font.webp`,
    `${urlPrefix}/lee-hon-kong-kai-font/img-1.webp`,
    `${urlPrefix}/lee-hon-kong-kai-font/img-2.webp`,
    `${urlPrefix}/lee-hon-kong-kai-font/img-3.webp`,
    `${urlPrefix}/lee-hon-kong-kai-font/title.svg`,
  ], // lee-hon-kong-kai.tsx
  [
    `${urlPrefix}/lee-hon-tung-kai-font/title-mobile.svg`,
    `${urlPrefix}/lee-hon-tung-kai-font/mobile-font.webp`,
    `${urlPrefix}/lee-hon-tung-kai-font/title.svg`,
  ], // lee-hon-tung-kai.tsx
  [
    `${urlPrefix}/prison/title-mobile.svg`,
    `${urlPrefix}/prison/mobile-font.webp`,
    `${urlPrefix}/prison/img-1.webp`,
    `${urlPrefix}/prison/title.svg`,
  ], // prison.tsx
]

export { urlPrefix, imgsForEachComponent }
