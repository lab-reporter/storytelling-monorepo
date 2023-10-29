# [@story-telling-reporter/react-karaoke](https://www.npmjs.com/package/@story-telling-reporter/react-karaoke) &middot; ![npm version](https://img.shields.io/npm/v/@story-telling-reporter/react-karaoke.svg?style=flat)

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

## Build (Webpack Bundles and ES5 Transpiling)
```
$ npm run build
// or
$ make build
```

### Build Webpack Bundles 
```
$ make build-dist
```

### Transpile React, ES6 Codes to ES5 
```
$ make build-lib
```

### NPM Publish
After executing `Build` scripts, we will have `./dist` and `/lib` folders,
and then we can execute publish command,
```
npm publish
```

Note: before publish npm package, we need to bump the package version first. 


## TODOs
- [ ] 建立 CI pipeline，透過 CI 產生 npm package，並且上傳至 npm registry
- [ ] 透過 Lerna 控制 packages 之間的版號
- [ ] 加入 React lazy load，讓 webpack 可以動態載入 webpack chunks
