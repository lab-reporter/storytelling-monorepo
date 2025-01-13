const pkgVersion = process.env.EMBED_CODE_GENERATOR_VERSION
  ? `${process.env.EMBED_CODE_GENERATOR_VERSION}`
  : 'latest'
const namespace = `@story-telling-reporter/react-embed-code-generator@${pkgVersion}`

Promise.all([
  import('./utils'),
  import(
    /**
     * Directly import file to avoid bundling redundant files.
     */
    /* webpackChunkName: "react-three-story-controls" */
    '@story-telling-reporter/react-three-story-controls/lib/react-components/scrollable-three-model'
  ),
  import('./constants'),
  import('regenerator-runtime/runtime'),
]).then(([{ render }, { ScrollableThreeModel }, { pkgNames }]) => {
  render(namespace, pkgNames.scrollableThreeModel, ScrollableThreeModel)
})
