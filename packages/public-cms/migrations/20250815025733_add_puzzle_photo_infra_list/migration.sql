-- CreateEnum
CREATE TYPE "PuzzlePhotoInfraShapeType" AS ENUM ('square', 'horizontalRectangle', 'verticalRectangle');

-- CreateEnum
CREATE TYPE "PuzzlePhotoInfraLayoutType" AS ENUM ('A1', 'B1', 'A2', 'B2', 'A3', 'B3', 'C3', 'D3', 'A4', 'B4', 'C4');

-- CreateTable
CREATE TABLE "PuzzlePhotoInfra" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "shape" "PuzzlePhotoInfraShapeType" NOT NULL DEFAULT 'square',
    "layout" "PuzzlePhotoInfraLayoutType" NOT NULL DEFAULT 'A1',
    "photo1" TEXT NOT NULL DEFAULT '',
    "fitMode1" TEXT DEFAULT 'width',
    "focusPosition1" TEXT DEFAULT 'center',
    "photo2" TEXT NOT NULL DEFAULT '',
    "fitMode2" TEXT DEFAULT 'width',
    "focusPosition2" TEXT DEFAULT 'center',
    "photo3" TEXT NOT NULL DEFAULT '',
    "fitMode3" TEXT DEFAULT 'width',
    "focusPosition3" TEXT DEFAULT 'center',
    "photo4" TEXT NOT NULL DEFAULT '',
    "fitMode4" TEXT DEFAULT 'width',
    "focusPosition4" TEXT DEFAULT 'center',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by" INTEGER,

    CONSTRAINT "PuzzlePhotoInfra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PuzzlePhotoInfra_created_by_idx" ON "PuzzlePhotoInfra"("created_by");

-- AddForeignKey
ALTER TABLE "PuzzlePhotoInfra" ADD CONSTRAINT "PuzzlePhotoInfra_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
