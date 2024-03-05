-- AlterTable
ALTER TABLE "ScrollableVideo" ALTER COLUMN "customCss" SET DEFAULT '
/* 將捲動式影片向左移動，撐滿文章頁 */
@media (max-width: 767px) {
  .scrollable-video.container {
    margin-left: -3.4vw;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .scrollable-video.container {
    margin-left: calc((100vw - 512px)/2 * -1);
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .scrollable-video.container {
    margin-left: calc((100vw - 550px)/2 * -1);
  }
}

@media (min-width: 1440px) {
  .scrollable-video.container {
    margin-left: calc((100vw - 730px)/2 * -1);
  }
}

/* 覆寫所有區塊預設的 css */
.scrollable-video.section {
  /* 例如：background-color: pink; */
}

/* 覆寫所有區塊內圖說預設的 css */
.scrollable-video.section draft-image-desc {
}

/* 覆寫所有區塊內抽言預設的 css */
.scrollable-video.section .draft-blockquote {
}

/* 覆寫所有區塊內 H2 預設的 css */
.scrollable-video.section .draft-header-two {
}

/* 覆寫所有區塊內 H3 預設的 css */
.scrollable-video.section .draft-header-three {
}

/* 覆寫所有區塊內內文預設的 css */
.scrollable-video.section .draft-paragraph {
}

/* 覆寫所有區塊內超連結預設的 css */
.scrollable-video.section .draft-link {
}

/* 覆寫所有區塊內 annotation 預設的 css */
.scrollable-video.section .annotation-wrapper {
}
.scrollable-video.section .annotation-title {
}
.scrollable-video.section .annotation-body {
}
      ';
