# [@story-telling-reporter/react-dual-slides](https://www.npmjs.com/package/@story-telling-reporter/react-dual-slides) &middot; ![npm version](https://img.shields.io/npm/v/@story-telling-reporter/react-dual-slides.svg?style=flat)

## Demo
<img src="https://user-images.githubusercontent.com/3000343/235827137-a1468a86-398b-4c5d-9f8c-cea30341afad.gif">

## Usage Example
```javascript
import DualSlides from '@story-telling-reporter/react-dual-slides'
import React from 'react'
import { createRoot } from 'react-dom/client'
const reactRootId = 'root'
const container = document.getElementById(reactRootId)
const root = createRoot(container)

const slides: [
    {
      content: [
        'In a dense forest lived a red fox named Rusty. He was cunning and always on the hunt for food. One day, while wandering through the woods, he came across a family of rabbits enjoying a delicious carrot feast. Rusty knew he had to find a way to get his paws on those carrots.',
      ],
      imgSrc: 'https://user-images.githubusercontent.com/3000343/235827862-d76f4e1d-3e32-4aab-9790-945738abcc4e.jpg',
    },
    {
      content: [
        'He hatched a plan to lure the rabbits away from their meal. Rusty pretended to be stuck in a trap, wailing for help. One of the rabbits took pity and approached him, but as soon as the rabbit got close enough, Rusty sprang up and snatched the carrot from his grasp. The rabbits were furious and vowed to never let Rusty get the best of them again.',
      ],
      imgSrc: 'https://user-images.githubusercontent.com/3000343/235827868-4ed5507e-8881-4b69-9cf0-40282d6b3898.jpg',
    },
    {
      content: ['But Rusty wasn\'t deterred. He came up with an even more devious plan to steal from the rabbits. He disguised himself as a friendly hedgehog and befriended the rabbits. He even helped them gather carrots and other food. However, one day, Rusty\'s true identity was revealed, and the rabbits chased him out of their territory. From that day on, Rusty learned that deceit would never bring true friendship and loyalty.'],
      imgSrc: 'https://user-images.githubusercontent.com/3000343/235827873-823da419-adb3-4a2c-b71a-f558b2b33f22.jpg',
    },
  ]

root.render(
  <DualSlides slides={mocks.slides} />
)
```

## Create Embed Code
See [@story-telling-reporter/react-embed-code-generator](https://github.com/nickhsine/story-telling-reporter/blob/main/packages/embed-code-generator/README.md) for more information.

## Installation
`yarn install`

## Development
```
$ yarn dev
// or
$ npm run dev
// or
$ make dev
```

## Build (React, ES6 above Transpiling)
```
$ npm run build
// or
$ make build
```

### NPM Publish
After executing `Build` scripts, we will have `/lib` folders,
and then we can execute publish command,
```
npm publish
```

Note: before publish npm package, we need to bump the package version first. 
