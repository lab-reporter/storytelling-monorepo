# 拼圖照片-基礎建設
為開發中的專案，完成了初步開發。
目的是可以快速產生多種多圖的畫面構圖。
每一個生成的構圖是以方塊為基底，方塊有三種形狀，每一種都有十一種版面組合。且皆會因應螢幕寬度不同有所不同。
- 方塊形狀
    - 正方
    - 橫方
    - 直方
- 版面組合
    - 1A：一張照片，完全撐滿畫面
    - 1B：一張照片，照片和方塊之間天地左右均保留 50px 間距
    - 2A：二張照片，照片間距和方塊之間的間距相同、照片群組水平居中、照片比例3:2
    - 2B：二張照片，照片間距和方塊之間的間距相同、照片群組垂直居中、照片比例2:3
    - 3A：三張照片，照片間距和方塊之間的間距相同、照片群組水平居中、照片比例3:2
    - 3B：二張照片，照片間距和方塊之間的間距相同、照片群組垂直居中（手機版例外）、照片比例2:3
    - 3C：三張照片，照片之間間距相同、照片群組垂直且水平居中（手機版例外）、照片一直圖（比例2:3）二橫圖（比例3:2）
    - 3D：三張照片，照片之間間距相同、照片群組垂直且水平居中（手機版例外）、照片一橫圖（比例3:2）二直圖（比例2:3）
    - 4A：四張照片，照片間距和方塊之間的間距相同、照片群組垂直居中、照片比例3:2
    - 4B：四張照片，照片間距和方塊之間的間距相同、照片群組水平居中、照片比例2:3
    - 4C：四張照片，照片之間間距相同、照片群組垂直且水平居中（手機版例外）、照片二直圖（比例2:3）二橫圖（比例3:2）
- RWD 尺寸
    - HD: 1440px ~
    - Desktop: 1024px ~ 1439px
    - Tablet: 768px ~ 1023px
    - Mobile: ~ 767px

## 專案結構
專案大致的目錄結構如下：
``` bash
.
├── Makefile
├── dev
│   ├── webpack.config.mjs
│   ├── entry.js
│   └── ...
├── package.json
└── src
    ├── PhotoGallery.tsx
    ├── PhotoGroup.tsx
    ├── PhotoGroupWrapper.tsx
    ├── PhotoLayout.tsx
    ├── PhotoLayouts
    │   ├── Desktop.tsx
    │   ├── HD.tsx
    │   ├── Mobile.tsx
    │   └── Tablet.tsx
    ├── RectangleContainer.tsx
    ├── ZoomGlobalStyle.ts
    ├── index.tsx
    └── types.ts
```
- `dev` 中放的是可以透過 Webpack 打包測試的設定檔 `webpack.config.mjs` 和進入點 `entry.js`。
- `src` 下就是達到不同畫面構圖的 source code 當中每一張照片皆可以進行縮放，這個效果是透過 [medium-zoom](https://github.com/francoischalifour/medium-zoom) library 完成
    - `ZoomGlobalStyle.ts` 針對該 medium-zoom library 的 CSS styles 進行調整
    - `types.ts` 定義了造成不同版面的參數
    - `index.tsx` 為使用的入口，會將外部參數傳入 `PhotoGallery.tsx` 中，`PhotoGallery.tsx` 會進行版面的 render
    - `PhotoGallery.tsx` 中透過了 `mediumZoom`  達到圖片的縮放。並透過 `PhotoGroup.tsx` 進行多張照片的排版，而每張照片個別的排版在 `PhotoLayout.tsx` 中處理。
    - `PhotoGroup.tsx` 定義了方塊中所有照片之間的排版。
    - `PhotoLayout.tsx` 定義了個別照片在不同版面中的尺寸大小。
    - `RectangleContainer.tsx` 為不同方塊的版面大小，由 `PhotoGroup` 繼承。
    - `PhotoGroup`、`PhotoLayout`、`RectangleContainer` 中皆有針對螢幕寬度的 RWD 設定，其中 `PhotoLayout` 較為繁複因此將它們拉到 `PhotoLayout/` 資料夾下。

## 可使用參數
``` js
// types.tsx
export type ShapeType = 'square' | 'horizontalRectangle' | 'verticalRectangle'
export type VariantType = 'line' | 'grid'
export type GridType = 'leftBig' | 'topBig' | 'uniform' | 'mixed'
export type FitModeType = 'width' | 'height'
export type FocusPositionType = 'left' | 'center' | 'right'

export type LayoutProps = {
  photoCount: number
  shape: ShapeType
  hasPadding?: boolean
  isVertical?: boolean
  variant?: VariantType
  grid?: GridType
  index?: number
}
```
`types.tsx` 定義的參數可以對應到不同的版面設計
- `ShapeType`：為方塊形狀
    - `square`：正方
    - `horizontalRectangle`：橫方
    - `verticalRectangle`：直方
- `VariantType`：為組合是多張排成一線或是呈現網格排列
    - `line`：線狀，並搭配 `LayoutProps` 中的 `isVertical` 決定是成直線還是橫線（若 `isVertical` 為 `true` 就是組合 2A、3A）
    - `grid`：網格，並搭配下面的 `GridType` 使用
- `GridType`：不同的網格形式
    - `leftBig`：左圖較大，組合 3C
    - `topBig`：上圖較大，組合 3D
    - `uniform`：4 張圖一樣大，組合 4A、4B，搭配 `isVertical` 決定整體視覺為長或橫（若 `isVertical` 為 `true` 就是組合 4B）
    - `mixed`：4 張圖大，組合 4C
- `FitModeType`：照片要透過寬度或高度撐滿
- `FocusPositionType`：照片要置左、置中、置右對齊
- `hasPadding`：為 1 張照片組合中決定要不要 padding 的參數（若為 `true` 就是組合 1B）

### 版面組合與對應參數
- 1A
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      hasPadding: false
    }
    ```
- 1B
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      hasPadding: true
    }
    ```
- 2A
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      isVertical: true
    }
    ```
- 2B
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      isVertical: false
    }
    ```
- 3A
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      isVertical: true
      variant: 'line' 
    }
    ```
- 3B
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      isVertical: false
      variant: 'line' 
    }
    ```
- 3C
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      variant: 'grid'
      grid: 'leftBig'
    }
    ```
- 3D
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      variant: 'grid'
      grid: 'topBig'
    }
    ```
- 4A
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      isVertical: false
      variant: 'grid'
      grid: 'uniform'
    }
    ```
- 4B
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      isVertical: true
      variant: 'grid'
      grid: 'uniform'
    }
    ```
- 4C
    ``` js
    LayoutProps = {
      shape: 'square' | 'horizontalRectangle' | 'verticalRectangle'
      variant: 'grid'
      grid: 'mixed'
    }
    ```
