-- AlterTable
ALTER TABLE "ScrollableVideo" ALTER COLUMN "customCss" SET DEFAULT '
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
    .draft-header-two h2 {
    }

    /* 覆寫所有區塊內 H3 預設的 css */
    .draft-header-three h3 {
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
      ';
