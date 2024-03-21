const pkgVersion = process.env.EMBED_CODE_GENERATOR_VERSION
  ? `${process.env.EMBED_CODE_GENERATOR_VERSION}`
  : 'latest'
const namespace = `@story-telling-reporter/react-embed-code-generator@${pkgVersion}`

Promise.all([
  import('./utils'),
  import(
    /* webpackChunkName: "react-karaoke" */
    '@story-telling-reporter/react-karaoke'
  ),
  import('./constants'),
  import('regenerator-runtime/runtime'),
]).then(([{ render }, { Karaoke }, { pkgNames }]) => {
  render(namespace, pkgNames.karaoke, Karaoke)
})
