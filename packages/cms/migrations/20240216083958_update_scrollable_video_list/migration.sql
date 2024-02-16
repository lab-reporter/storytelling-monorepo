-- AlterTable
ALTER TABLE "ScrollableVideo" ADD COLUMN     "customCss" TEXT NOT NULL DEFAULT '
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
