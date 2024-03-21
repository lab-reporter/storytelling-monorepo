const pkgVersion = process.env.EMBED_CODE_GENERATOR_VERSION
  ? `${process.env.EMBED_CODE_GENERATOR_VERSION}`
  : 'latest'
const namespace = `@story-telling-reporter/react-embed-code-generator@${pkgVersion}`

Promise.all([
  import('./utils'),
  import(
    /* webpackChunkName: "react-subtitled-audio" */
    '@story-telling-reporter/react-subtitled-audio'
  ),
  import('./constants'),
  import('regenerator-runtime/runtime'),
]).then(([{ render }, { KidsSubtitledAudio }, { pkgNames }]) => {
  render(namespace, pkgNames.subtitledAudio, KidsSubtitledAudio)
})
