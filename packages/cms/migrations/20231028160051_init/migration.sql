-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "file_filesize" INTEGER,
    "file_filename" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "file_filesize" INTEGER,
    "file_filename" TEXT,
    "coverPhoto" INTEGER,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "imageFile_filesize" INTEGER,
    "imageFile_extension" TEXT,
    "imageFile_width" INTEGER,
    "imageFile_height" INTEGER,
    "imageFile_id" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Karaoke" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "quote" TEXT NOT NULL DEFAULT '',
    "audio_filesize" INTEGER,
    "audio_filename" TEXT,
    "imageFile_filesize" INTEGER,
    "imageFile_extension" TEXT,
    "imageFile_width" INTEGER,
    "imageFile_height" INTEGER,
    "imageFile_id" TEXT,
    "audioLink" TEXT NOT NULL DEFAULT '',
    "imageLink" TEXT NOT NULL DEFAULT '',
    "muteHint" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Karaoke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreeStoryPoint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "model_filesize" INTEGER,
    "model_filename" TEXT,
    "desktopModel_filesize" INTEGER,
    "desktopModel_filename" TEXT,
    "lightModel_filesize" INTEGER,
    "lightModel_filename" TEXT,
    "captions" JSONB DEFAULT '[]',
    "audios" JSONB DEFAULT '[{"urls":[],"preload":"auto"}]',
    "cameraRig" JSONB DEFAULT '{"pois":[]}',
    "debugMode" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ThreeStoryPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DualSlide" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slides" JSONB DEFAULT '[{"content":[""],"imgSrc":""}]',

    CONSTRAINT "DualSlide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Video_coverPhoto_idx" ON "Video"("coverPhoto");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_coverPhoto_fkey" FOREIGN KEY ("coverPhoto") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
