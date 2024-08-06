import React from 'react'
import { CameraHelper } from '../src/react-components/camera-helper'
import { createRoot } from 'react-dom/client'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container!)

function Root() {
  const modelUrl = './model.glb'
  return (
    <div>
      <CameraHelper
        modelObjs={[
          {
            url: modelUrl,
          },
        ]}
      />
    </div>
  )
}

function render() {
  root.render(<Root />)
}

render()
