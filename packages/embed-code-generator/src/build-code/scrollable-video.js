const pkgVersion = process.env.EMBED_CODE_GENERATOR_VERSION
  ? `${process.env.EMBED_CODE_GENERATOR_VERSION}`
  : 'latest'
const namespace = `@story-telling-reporter/react-embed-code-generator@${pkgVersion}`

Promise.all([
  import('./utils'),
  import(
    /* webpackChunkName: "react-scrollable-video" */
    '@story-telling-reporter/react-scrollable-video'
  ),
  import('./constants'),
  import('regenerator-runtime/runtime'),
]).then(
  ([{ render }, { ScrollableVideoForKeystoneEditorCMS }, { pkgNames }]) => {
    render(
      namespace,
      pkgNames.scrollableVideo,
      ScrollableVideoForKeystoneEditorCMS
    )
  }
)
