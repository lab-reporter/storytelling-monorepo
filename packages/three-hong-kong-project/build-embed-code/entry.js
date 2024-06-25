Promise.all([
  import(
    /* webpackChunkName: "react-three-hong-kong-project" */
    '../src/index'
  ),
  import('react-dom/client'),
  import('./constants'),
  import('regenerator-runtime/runtime'),
]).then(([{ EmbedHongKongFontProject }, { createRoot }, { containerId }]) => {
  const container = document.getElementById(containerId)
  const root = createRoot(container)
  root.render(<EmbedHongKongFontProject embedInTwreporterReact />)
})
