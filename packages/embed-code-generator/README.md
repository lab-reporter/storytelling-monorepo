# [@story-telling-reporter/react-embed-code-generator](https://www.npmjs.com/package/@story-telling-reporter/react-embed-code-generator) &middot; ![npm version](https://img.shields.io/npm/v/@story-telling-reporter/react-embed-code-generator.svg?style=flat)

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

### Manually Build and Publish
Since we haven't adopt lerna or other monorepo management tools, we have to build and publish new codes by ourselves.

You can follow the following steps to create a new subpkg on the npmjs registry.

1. update `pacakge.json` `version` property (make sure you update version before build since build process will refer to pkg version)
2. `yarn build`: transpile codes and build webpack bundles
3. `npm publish`: publish built files onto npmjs registry

### Monorepo Settings
Due to manual building and publishing, we might encounter collaboration problems. 
You can see this [PR](https://github.com/readr-media/react/pull/138) for more information.

Since this subpkg is NOT under `workspaces` control,
please do not forget to commit `yarn.lock` if changed.
