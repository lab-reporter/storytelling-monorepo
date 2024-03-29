/*
  Warnings:

  - You are about to drop the column `secondsPer100vh` on the `ScrollableVideo` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `ScrollableVideo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScrollableVideo" DROP COLUMN "secondsPer100vh",
DROP COLUMN "theme",
ALTER COLUMN "editorState" SET DEFAULT '{"captions":[],"videoSrc":"","videoDuration":0,"theme":"light_mode","secondsPer100vh":1.5}';
