/*
  Warnings:

  - You are about to drop the column `audioLink` on the `Karaoke` table. All the data in the column will be lost.
  - You are about to drop the column `imageFile_extension` on the `Karaoke` table. All the data in the column will be lost.
  - You are about to drop the column `imageFile_filesize` on the `Karaoke` table. All the data in the column will be lost.
  - You are about to drop the column `imageFile_height` on the `Karaoke` table. All the data in the column will be lost.
  - You are about to drop the column `imageFile_id` on the `Karaoke` table. All the data in the column will be lost.
  - You are about to drop the column `imageFile_width` on the `Karaoke` table. All the data in the column will be lost.
  - You are about to drop the column `imageLink` on the `Karaoke` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Karaoke" DROP COLUMN "audioLink",
DROP COLUMN "imageFile_extension",
DROP COLUMN "imageFile_filesize",
DROP COLUMN "imageFile_height",
DROP COLUMN "imageFile_id",
DROP COLUMN "imageFile_width",
DROP COLUMN "imageLink",
ADD COLUMN     "theme" TEXT DEFAULT 'twreporter',
ADD COLUMN     "webVtt" TEXT NOT NULL DEFAULT 'WEBVTT
00:00:00.000 --> 00:00:04.500
演員，我覺得他就是一個生活的體驗者,

00:00:04.600 --> 00:00:07.500
然後生命的實踐家;

00:00:08.000 --> 00:00:11.000
期許自己啦，可以這麼做。
';
