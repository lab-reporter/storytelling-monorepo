// import Karaoke from '../src/react-components'
import React from 'react' // eslint-disable-line
import { createRoot } from 'react-dom/client'
import { PuzzlePhotoInfra } from '../src/index'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

root.render(
  <div>
    <PuzzlePhotoInfra photoUrls={['./photo-1.jpg']} />
  </div>
)
