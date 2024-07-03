## Demo
請見[用字體留住消逝的街景記憶──香港的野生造字人們](https://www.twreporter.org/a/never-forget-hong-kong-vanishing-street-and-font-designers)，元件在開頭捲動式影片下方。

因為 iPhone Safari 在處理 3D model 會遇到效能問題，手機版的元件僅採用圖文方式呈現，沒有採取 ThreeJS 3D 技術來渲染畫面。

## Installation
`yarn install`

## Development
```sh
$ yarn dev
// or
$ npm run dev
// or
$ make dev
```

## Build
```sh
$ npm run build
// or
$ make build
```

`make build` 會執行以下動作：
1. 將 `src/*` 的 TypeScript + React 程式碼轉譯 (transpile) 進 `lib/` 資料夾，分別轉成 esm (`lib/esm`) 和 cjs (`lib/cjs`) 兩個版本。
2. 將 `src/*` 底下的程式碼，透過 webpack 打包成可以執行的 js bundles，js bundles 會放在 `webpack-bundles/` 資料夾底下。

在產生 webpack-bundles 時，可以搭配 `RESOURCES_HOSTED_AT` 環境變數，該變數接受三種值：`local`, `github` 和 `gcs`。

#### `RESOURCES_HOSTED_AT=local`
當 `RESOURCES_HOSTED_AT=local` 時，所有的資源都是從 local 讀取。(`yarn dev` 就是預設 `RESOURCES_HOSTED_AT=local`）

#### `RESOURCES_HOSTED_AT=gcs`
當 `RESOURCES_HOSTED_AT=gcs` 時，所有的資源皆從 Google Cloud Storage 的 `gs://story-telling-storage.twreporter.org/projects/three-hong-kong-project` 底下讀取。目前[用字體留住消逝的街景記憶──香港的野生造字人們](https://www.twreporter.org/a/never-forget-hong-kong-vanishing-street-and-font-designers)網頁即是使用此參數。

你可以透過 Google Cloud Platform 的網頁上傳圖片和 3D models 檔案和 `webpack-bundles` 資料夾，也可以透過 `gsutils` 等 cli 來處理。

#### `RESOURCES_HOSTED_AT=github`
當 `RESOURCES_HOSTED_AT=github` 時，圖片、3D models 檔案皆從 GitHub 上讀取，但 JavaScript bundles 則從 CDN https://unpkg.com 下載。
所以要記得將資源檔案上傳到 GitHub，並將 `webpack-bundles` 資料夾 publish 到 unpkg 上。（請見 npm Publish 章節）

## npm Publish
如果 `make build` 時，`RESOURCES_HOSTED_AT` 環境變數是使用 `github` 的話，我們必須把 build 完的結果上傳到 npm registry 上；
如此一來，我們便可以使用 unpkg CDN 來下載和執行 JavaScript bundles。

具體操作如下：
1. 先更新 package.json#version。因為 npm publish 時，會認版本號，所以需要先更新版號才能上傳檔案。
2. `RESOURCES_HOSTED_AT=github make build`。產生新的 webpack-bundles。
3. `npm publish`。上傳新的 webpack-bundles。

## 產生 Embed Code
當 `webpack-bundles`、3D Models 和圖片等檔案都上傳完畢後，
便可以使用 `make build-embed-code` 來產生 embed codes。

