-- CreateTable
CREATE TABLE "SubtitledAudio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "audio_filesize" INTEGER,
    "audio_filename" TEXT,
    "webVtt" TEXT NOT NULL DEFAULT 'WEBVTT

00:00:00.000 --> 00:00:02.500
我想和14歲的妳說

00:00:03.500 --> 00:00:12.500
妳經歷了很多事，有些是好事，有些的確不太好，也帶來某種難以言喻的創傷。',

    CONSTRAINT "SubtitledAudio_pkey" PRIMARY KEY ("id")
);
