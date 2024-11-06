import React from 'react' // eslint-disable-line
import { createRoot } from 'react-dom/client'
import { ScrollableImage } from '../src/scrollable-image'

const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

root.render(
  <div style={{ marginTop: '100vh', marginBottom: '100vh' }}>
    <ScrollableImage
      height="90vh"
      maxHeight="800px"
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
      captions={[
        {
          data: '紅檜聞起來有花香，清香味，較甜',
          width: '5%',
          position: {
            left: '45%',
            top: '10%',
          },
        },
        {
          data: '扁柏聞起來有檸檬香茅味，較辛辣',
          width: '5%',
          position: {
            left: '26%',
            top: '10%',
          },
        },
      ]}
    />
  </div>
)
