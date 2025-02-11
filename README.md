# storytelling-reporter-monorepo

### Packages
此 monorepo 包含以下 packages：
- [@story-telling-reporter/cms](./packages/cms): see `packages/cms`
- [@story-telling-reporter/public-cms](./packages/public-cms): see `packages/public-cms`
- [@story-telling-reporter/draft-editor](./packages/draft-editor): see `packages/draft-editor`
- [@story-telling-reporter/react-embed-code-generator](./packages/embed-code-generator): see `packages/embed-code-generator`
- [@story-telling-reporter/react-karaoke](./packages/karaoke): see `packages/karaoke`
- [@story-telling-reporter/react-scroll-to-aduio](./packages/scroll-to-aduio): see `packages/scroll-to-aduio`
- [@story-telling-reporter/react-scrollable-image](./packages/scrollable-image): see `packages/scrollable-image`
- [@story-telling-reporter/react-scrollable-video](./packages/scrollable-video): see `packages/scrollable-video`
- [@story-telling-reporter/react-subtitled-audio](./packages/subtitled-audio): see `packages/subtitled-audio`
- [@story-telling-reporter/react-three-story-controls](./packages/three-story-controls): see `packages/three-story-controls`
- [@story-telling-reporter/react-ui-toolkit](./packages/ui-toolkit): see `packages/ui-toolkit`

### Installation
我們使用 yarn v1 來管理 workspaces 和 dependencies。
因此，在安裝 dependecies 之前，請先確認 yarn 的版本。

在 root 資料夾底下，可以透過 `yarn install` 安裝整個 monorepo 裡所需要的 dependencies。
monorepo 的 workspaces 會將 `./packages/*` 底下可以共用的 dependencies hoist 到 root 的 `./node_modules` 底下。
`./packages/*/node_modules` 僅會安裝無法 hoist 的 dependencies。

### 如何在 workspaces 中新增 subpkg？
新增 subpkg 的 convention 是在 `./packages/` 底下新增資料夾和檔案，
並且在 root 的 packages.json#workspaces 的 array 中新增 `"packages/${subpkg}"`。

若在同一個 monorepo 中的 subpkgs 之間有相依性，例如：`@story-telling-reporter/cms` 依賴 `@story-telling-reporter/react-embed-code-generator`，而 `@story-telling-reporter/react-embed-code-generator` 依賴 `@story-telling-reporter/react-scrollable-video`，workspaces 能讓你在 local 端使用 soft link 的方式連結到其他的 subpkgs 去；但要注意你在 packages.json 的 dependencies 裡標示的 name 和 version 要正確。

例如：
```
// in packages/cms/package.json

"dependencies": {
  "@story-telling-reporter/react-embed-code-generator": "1.0.0",
}

// in packages/embed-code-generator/package.json
"name": "@story-telling-reporter/react-embed-code-generator",
"version": "1.0.0"

```

當 `./packages/embed-code-generator/package.json` 的 `name` 和 `version` 與 `packages/cms/package.json` 的 `dependencies`.`@story-telling-reporter/react-embed-code-generator` 一樣時，yarn install 並不會額外從 npm registry 下載 `@story-telling-reporter/react-embed-code-generator` pkg，反倒是會建立 soft link，讓 `./node_modules/@story-telling-reporter/react-embed-code-generator` 指到 `./packages/embed-code-generator` 去。

如此一來，就可以在 local 端一次開發多個 subpkgs。
