import React from 'react' // eslint-disable-line
import { createRoot } from 'react-dom/client'
import { ScrollableImage } from '../src/scrollable-image'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

root.render(
  <div style={{ marginTop: '100vh', marginBottom: '100vh' }}>
    <ScrollableImage
      imgs={[
        {
          url: '/static/img-1.png',
        },
        {
          url: '/static/img-2.png',
        },
        {
          url: '/static/img-3.png',
        },
        {
          url: '/static/img-4.png',
        },
        {
          url: '/static/img-5.png',
        },
      ]}
    />
  </div>
)
