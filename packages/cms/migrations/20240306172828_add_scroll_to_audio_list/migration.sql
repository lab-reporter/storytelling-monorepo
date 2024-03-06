-- CreateTable
CREATE TABLE "ScrollToAudio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "audio_filesize" INTEGER,
    "audio_filename" TEXT,

    CONSTRAINT "ScrollToAudio_pkey" PRIMARY KEY ("id")
);
