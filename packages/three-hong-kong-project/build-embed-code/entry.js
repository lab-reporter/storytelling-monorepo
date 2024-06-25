import { createRoot } from 'react-dom/client'
import { containerId } from './constants'

Promise.all([
  import(
    /* webpackChunkName: "react-three-hong-kong-project" */
    '../src/index'
  ),
  import('regenerator-runtime/runtime'),
]).then(([{ HongKongFontProjectForKeystoneEditorCMS }]) => {
  const container = document.getElementById(containerId)
  const root = createRoot(container)
  root.render(<HongKongFontProjectForKeystoneEditorCMS />)
})
