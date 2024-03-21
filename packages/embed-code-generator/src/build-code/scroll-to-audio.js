const pkgVersion = process.env.EMBED_CODE_GENERATOR_VERSION
  ? `${process.env.EMBED_CODE_GENERATOR_VERSION}`
  : 'latest'
const namespace = `@story-telling-reporter/react-embed-code-generator@${pkgVersion}`

Promise.all([
  import('./utils'),
  import(
    /* webpackChunkName: "react-scroll-to-audio" */
    '@story-telling-reporter/react-scroll-to-audio'
  ),
  import('./constants'),
  import('regenerator-runtime/runtime'),
]).then(([{ render }, { ScrollToAudio }, { pkgNames }]) => {
  render(namespace, pkgNames.scrollToAudio, ScrollToAudio)
})
