const pkgVersion = process.env.EMBED_CODE_GENERATOR_VERSION
  ? `${process.env.EMBED_CODE_GENERATOR_VERSION}`
  : 'latest'
const namespace = `@story-telling-reporter/react-embed-code-generator@${pkgVersion}`

Promise.all([
  import('./utils'),
  import(
    /* webpackChunkName: "react-puzzle-photo-infra" */
    '@story-telling-reporter/react-puzzle-photo-infra'
  ),
  import('./constants'),
  import('regenerator-runtime/runtime'),
]).then(([{ hydrate }, { PuzzlePhotoInfra }, { pkgNames }]) => {
  hydrate(namespace, pkgNames.puzzlePhotoInfra, PuzzlePhotoInfra)
})
