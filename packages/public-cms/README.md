# @story-telling-reporter/public-cms

## Preface

此Repo

- 使用[KeystoneJS 6](https://keystonejs.com/docs)來產生CMS服務。
- 串接 Cloud Build 產生 Docker image 和部署到 Cloud Run 上。

## Getting started on local environment

### Start PostgreSQL instance

在起 CMS 服務前，需要在 local 端先起 PostgreSQL database。
而我們可以透過 [Docker](https://docs.docker.com/) 快速起 PostgreSQL database。
在電腦上安裝 Docker 的方式，可以參考 [Docker 安裝文件](https://docs.docker.com/engine/install/)。
安裝 Docker 後，可以執行以下 command 來產生 local 端需要的 PostgreSQL 服務。

```bash
docker run -p 5432:5432 --name story-telling-public-cms -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=story-telling-public-cms -d postgres
```

註：
`POSTGRES_PASSWORD`, `POSTGRES_USER` 和 `POSTGRES_DB` 都可更動。
只是要注意，改了後，在起 CMS 的服務時，也要更改傳入的 `DATABASE_URL` 環境變數。

### Install dependencies

我們透過 yarn 來安裝相關套件。

```bash
yarn install
```

### Start dev instance

確定 PostgreSQL 服務起來和相關套件安裝完畢後，可以執行以下 command 來起 CMS 服務

```bash
yarn dev
```

or

```bash
npm run dev
```

如果你的 database 的設定與上述不同，
可以透過 `DATABASE_URL` 環境變數傳入。

```bash
DATABASE_URL=postgres://anotherAccount:anotherPasswd@localhost:5433/anotherDatabase yarn dev
// or
DATABASE_URL=postgres://anotherAccount:anotherPasswd@localhost:5433/anotherDatabase npm run dev
```

成功將服務起來後，使用瀏覽器打開 [http://localhost:3000](http://localhost:3000)，便可以開始使用 CMS 服務。

### GraphQL playground

起 CMS 服務後，我們可以透過 [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql) 來使用 GraphQL playground。


### Database Migration （建議同步參考 [Keystone 文件](https://keystonejs.com/docs/guides/database-migration#title)）

Keystone 底層是透過 [Prisma](https://github.com/prisma/prisma)來管理資料庫（Postgres）。
當我們更動 Keystone List，例如：`lists/user.ts`，Keystone 會根據改動調整 `schema.grahpql` 和 `schema.prisma` 兩個檔案。
`schema.graphql` 會影響 GraphQL API 的 schema，而 `schema.prisma` 則會影響與資料庫的串接。

在 `migrations/` 資料夾底下，存放所有 migration 的歷史紀錄。
在部署 CMS 服務到 Cloud Run 上時，Keystone 會逐一執行 `migrations/` 底下的檔案，確保資料庫現有的 schema 與要部署的程式碼相符。
因此，當 `schema.prisma` 檔案有所更動時，我們就需要執行 database migration，並將改動的內容寫進 `migrations/` 資料夾底下。

#### 1. 產生新的 `schema.prisma` 和 database schema

上述有說到，當有新的 `schema.prisma` 時，要產生新的 migration 檔案。
但是，我們要怎麼根據修改的 list 去產生新的 `schema.prisma` 呢？
我們需要在 local 端跑 `yarn dev` 。
`yarn dev` 會預設會執行 auto migration，所以會將新的 list 所產生的 schema 直接覆蓋 database 的 schema，
也會修改 `schema.prisma`。

#### 2. 產生 migration 檔案

當 database 的 schema 有所改動，其 databsase schema 就會與 `migrations/` 底下的檔案產生差異，
我們會需要為這些差異產生新的 migration 檔案。
以下是推薦的做法：

1. (optional) Stop the Docker database instance if necessary.

    ```bash
    docker stop story-telling-public-cms;
    ```

2. Run a new Docker container for the database migration.

    ```bash
    docker run -p 5432:5432 --name story-telling-public-cms-migration -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -e POSTGRES_DB=story-telling-public-cms -d postgres;
    ```

    We run a new instance because Prisma migrations clean up all data before generating migration files.

3. Auto migrate new list schemas

    ```bash
    yarn dev;
    ```

    You can enter CTRL+C to stop Keystone server after auto migration done

4. Generate new migration file for schema changes

    ```bash
    yarn keystone prisma migrate dev --name 'example_migration_name'
    ```

    `example_migration_name` will be part of the file name of the migration file.

5. (optional) Stop the Docker container for the database migration.

    ```bash
    docker stop story-telling-public-cms-migration;
    ```

6. (optional) Start the Docker container for the database.

    ```bash
    docker start story-telling-public-cms;
    ```

7. (optional) Remove the Docker container for the database migration.

    ```bash
    docker rm story-telling-public-cms-migration;
    ```

    you may check if the container is removed by running `docker ps -a`.

#### 3. 上傳 migration 檔案和新的 schema.prisma 到 repo

Database migration 執行的時機點是在部署的時候，
因此，新產生的 `shema.prisma` 和 `migrations/example_migration_name` 檔案都需要進到 GitHub Repo 當中。
如果忘記上傳，則可能會遇到 Keystone server 跑不起來的狀況。

### Troubleshootings

#### Q1: 我在 `packages/public-cms` 資料夾底下跑 `yarn install` 時，在 `yarn postinstall` 階段發生錯誤。

A1: 如果錯誤訊息與 `@story-telling-reporter/draft-editor` 有關，可以嘗試先到 `packages/draft-editor` 底下，執行 `yarn build`。

確保 local 端有相關的檔案可以讓 `packages/public-cms` 載入。


## Using the CMS service

這個 CMS 服務用以管理報導者數位敘事元件庫，包含管理使用者資料、儲存數位內容、建立及編輯敘事元件等功能。

### Getting started

第一次進入 [http://localhost:3000](http://localhost:3000) 會需要註冊一組帳號並設定權限。
這組帳號就會被寫入透過 docker 所架設的 PostgreSQL 中，並可以透過 GraphQL 存取。

登入後看見的是透過 [`./admin/config.tsx`](./admin/config.tsx) 設定的管理介面，可以在這裡上傳建立元件所需要的物件（如音檔、照片）和建立元件物件。
我們能夠透過 [`./lists/`](./lists/) 定義物件的結構，例如 [`./lists/audio.ts`](./lists/audio.ts) 定義了音檔的所需的 fields 和它們在頁面（[http://localhost:3000/audio](http://localhost:3000/audio)）上會如何呈現。而新增或修改這些物件是怎麼影響資料庫的，可以參考 [Database Migration](#database-migration-建議同步參考-keystone-文件) 章節。

元件庫目前可以產生的元件包含：
- 捲到式聲音
- 捲動式影片
- 橫著滾吧！
- 大事記
- 左右互搏
- 大圖點我
- 捲動式3D（測試版）

其中，「大事記」、「左右互搏」、「大圖點我」為第一版元件，是透過 iframe 嵌入的，可以在 [`./admin/pages/iframe/`](./admin/pages/iframe/) 資料夾找到它們。
而剩下的為第二版的元件，我們可以透過 CMS 建立這些元件物件，它們的結構定義一樣可以在 [`./lists/`](./lists/) 資料夾下找到。

當我們建立元件物件時會呼叫 [@story-telling-reporter/react-embed-code-generator](../embed-code-generator) package 中並載入相對應的 packages 達成元件程式 source code 和 embed code 的產生。

以「[捲到式聲音](http://localhost:3000/scroll-to-audios)」元件為例，[`./lists/scroll-to-audio.ts`](./lists/scroll-to-audio.ts) 當中的 `startEmbedCode`、`endEmbedCode` 和 `hintEmbedCode` 都會用到 [@story-telling-reporter/react-embed-code-generator](../embed-code-generator) package 所 export 的 `buildScrollToAudioEmbedCode` function（定義在 [`../packages/embed-code-generator/src/build-code/index.js`](../packages/embed-code-generator/src/build-code/index.js) 中），而該 function 透過呼叫 [@story-telling-reporter/react-scroll-to-audio](../scroll-to-audio) package 產生 source code，並利用 `buildEmbedCode` function 產生 embed code。

個別元件的 source code 產生可參考個別元件 packages 下的 `src` 資料夾。
- 捲到式聲音：[`../scroll-to-audio/src/`](../scroll-to-audio/src/)
- 捲動式影片：[`../scrollable-video/src/`](../scrollable-video/src/)
- 橫著滾吧！：[`../scrollable-image/src`](../scrollable-image/src/)
- 捲動式3D（測試版）：[`../three-story-controls/src/`](../three-story-controls/src/)

