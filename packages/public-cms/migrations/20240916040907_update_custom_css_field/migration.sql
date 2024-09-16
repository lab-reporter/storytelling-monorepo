-- AlterTable
ALTER TABLE "ScrollableVideo" ALTER COLUMN "customCss" SET DEFAULT '
.scrollable-video {
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
