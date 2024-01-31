/*
  Warnings:

  - You are about to drop the column `mobileVideoUrl` on the `ScrollableVideo` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `ScrollableVideo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScrollableVideo" DROP COLUMN "mobileVideoUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "mobileVideoSrc" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "theme" TEXT DEFAULT 'light_mode',
ADD COLUMN     "videoSrc" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "editorState" SET DEFAULT '{"captions":[],"videoSrc":"","videoDuration":0}';
