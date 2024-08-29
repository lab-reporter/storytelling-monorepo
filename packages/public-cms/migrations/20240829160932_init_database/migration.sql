-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrollToAudio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "audioSrc" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by" INTEGER,

    CONSTRAINT "ScrollToAudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrollableThreeModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "modelSrc" TEXT NOT NULL DEFAULT '',
    "cameraHelperData" JSONB DEFAULT '{"plainPois":[],"animationClip":null,"modelObjs":[]}',

    CONSTRAINT "ScrollableThreeModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrollableVideo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "videoSrc" TEXT NOT NULL DEFAULT '',
    "mobileVideoSrc" TEXT NOT NULL DEFAULT '',
    "editorState" JSONB DEFAULT '{"captions":[],"videoSrc":"","videoDuration":0,"theme":"light_mode","secondsPer100vh":1.5}',
    "customCss" TEXT NOT NULL DEFAULT '
.scrollable-video {
  /* 將捲動式影片往上移動，使其與上一個區塊連接在一起。*/
  /* 使用情境範例：想要兩個捲動式影片連在一起，讓第二個捲動式影片與第一個影片沒有間隔。 */
  /* 刪除下方註解即可使用。 */
  /*
  &.container {
    margin-top: -40px;
  } 
  */

  /* 將捲動式影片向左移動，撐滿文章頁 */
  @media (max-width: 767px) {
    &.container {
      margin-left: -3.4vw;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    &.container {
      margin-left: calc((100vw - 512px)/2 * -1);
    }
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
    &.container {
      margin-left: calc((100vw - 550px)/2 * -1);
    }
  }

  @media (min-width: 1440px) {
    &.container {
      margin-left: calc((100vw - 730px)/2 * -1);
    }
  }

  /* 覆寫所有區塊預設的 css */
  .section {
    /* 例如：background-color: pink; */

    /* 覆寫所有區塊內圖說預設的 css */
    .draft-image-desc {
    }

    /* 覆寫所有區塊內抽言預設的 css */
    .draft-blockquote {
    }

    /* 覆寫所有區塊內 H2 預設的 css */
    .draft-header-two {
    }

    /* 覆寫所有區塊內 H3 預設的 css */
    .draft-header-three {
    }

    /* 覆寫所有區塊內內文預設的 css */
    .draft-paragraph {
    }

    /* 覆寫所有區塊內超連結預設的 css */
    .draft-link {
    }

    /* 覆寫所有區塊內 annotation 預設的 css */
    .annotation-wrapper {
    }
    .annotation-title {
    }
    .annotation-body {
    }
  }

}
      ',

    CONSTRAINT "ScrollableVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ScrollToAudio_created_by_idx" ON "ScrollToAudio"("created_by");

-- AddForeignKey
ALTER TABLE "ScrollToAudio" ADD CONSTRAINT "ScrollToAudio_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
