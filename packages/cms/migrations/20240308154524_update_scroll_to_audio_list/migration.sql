/*
  Warnings:

  - You are about to drop the column `audio_filename` on the `ScrollToAudio` table. All the data in the column will be lost.
  - You are about to drop the column `audio_filesize` on the `ScrollToAudio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScrollToAudio" DROP COLUMN "audio_filename",
DROP COLUMN "audio_filesize",
ADD COLUMN     "audioSrc" TEXT NOT NULL DEFAULT '';
