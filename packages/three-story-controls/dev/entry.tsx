import { CameraHelper } from '../src/react-components/camera-helper'
import React from 'react'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container!)

root.render(
  <div>
    <CameraHelper />
  </div>
)
