const pkgVersion = process.env.EMBED_CODE_GENERATOR_VERSION
  ? `${process.env.EMBED_CODE_GENERATOR_VERSION}`
  : 'latest'
const namespace = `@story-telling-reporter/react-embed-code-generator@${pkgVersion}`

Promise.all([
  import('./utils'),
  import(
    /* webpackChunkName: "react-scrollable-image" */
    '@story-telling-reporter/react-scrollable-image/lib/esm/scrollable-image-for-keystone-editor.js'
  ),
  import('./constants'),
  import('regenerator-runtime/runtime'),
]).then(
  ([{ render }, { ScrollableImageForKeystoneEditorCMS }, { pkgNames }]) => {
    render(
      namespace,
      pkgNames.scrollableImage,
      ScrollableImageForKeystoneEditorCMS
    )
  }
)
