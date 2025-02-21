/*
  Warnings:

  - You are about to drop the column `customCss` on the `ScrollableImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScrollableImage" DROP COLUMN "customCss",
ALTER COLUMN "editorState" SET DEFAULT '{"captions":[],"imgObjs":[],"customCss":"\n  /* 給報導者文章頁使用 */\n  /* 將元件往上移動，使其與上一個區塊連接在一起。*/\n  /* 刪除下方註解即可使用。 */\n  /*\n  .storytelling-react-scrollable-image-container {\n    margin-top: -40px;\n  }\n  */\n\n  /* 給報導者文章頁使用 */\n  /* 將元件向左移動，撐滿文章頁 */\n  /* 刪除下方註解即可使用。 */\n  /*\n  @media (max-width: 767px) {\n    .storytelling-react-scrollable-image-container {\n      margin-left: -3.4vw;\n    }\n  }\n\n  @media (min-width: 768px) and (max-width: 1023px) {\n    .storytelling-react-scrollable-image-container {\n      margin-left: calc((100vw - 512px)/2 * -1);\n    }\n  }\n\n  @media (min-width: 1024px) and (max-width: 1439px) {\n    .storytelling-react-scrollable-image-container {\n      margin-left: calc((100vw - 550px)/2 * -1);\n    }\n  }\n\n  @media (min-width: 1440px) {\n    .storytelling-react-scrollable-image-container {\n      margin-left: calc((100vw - 730px)/2 * -1);\n    }\n  }\n  */\n\n  /* 給少年報導者文章頁使用 */\n  /* 將元件向左移動，撐滿文章頁 */\n  /* 刪除下方註解即可使用。 */\n  /*\n  @media (max-width: 767px) {\n    .storytelling-react-scrollable-image-container {\n      margin-left: -5vw;\n    }\n  }\n\n  @media (min-width: 768px) {\n    .storytelling-react-scrollable-image-container {\n      margin-left: calc((100vw - 700px)/2 * -1);\n    }\n  }\n  */\n","className":"storytelling-react-scrollable-image-container"}';
