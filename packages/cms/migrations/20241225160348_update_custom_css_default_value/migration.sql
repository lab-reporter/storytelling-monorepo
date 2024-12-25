-- AlterTable
ALTER TABLE "ScrollableImage" ALTER COLUMN "customCss" SET DEFAULT '
  /* 將捲動式影片往上移動，使其與上一個區塊連接在一起。*/
  /* 使用情境範例：想要兩個捲動式影片連在一起，讓第二個捲動式影片與第一個影片沒有間隔。 */
  /* 刪除下方註解即可使用。 */
  /*
  .storytelling-react-scrollable-image-container {
    margin-top: -40px;
  }
  */

  /* 將捲動式影片向左移動，撐滿文章頁 */
  @media (max-width: 767px) {
    .storytelling-react-scrollable-image-container {
      margin-left: -3.4vw;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .storytelling-react-scrollable-image-container {
      margin-left: calc((100vw - 512px)/2 * -1);
    }
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
    .storytelling-react-scrollable-image-container {
      margin-left: calc((100vw - 550px)/2 * -1);
    }
  }

  @media (min-width: 1440px) {
    .storytelling-react-scrollable-image-container {
      margin-left: calc((100vw - 730px)/2 * -1);
    }
  }
}
      ';
