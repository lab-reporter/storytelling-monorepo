import { HongKongFontProjectForKeystoneEditorCMS } from '../src/index'
import React from 'react'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container!)

root.render(
  <div>
    <HongKongFontProjectForKeystoneEditorCMS />
  </div>
)
