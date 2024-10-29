/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Audio` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Audio` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `coverPhoto` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_coverPhoto_fkey";

-- DropIndex
DROP INDEX "Video_coverPhoto_idx";

-- AlterTable
ALTER TABLE "Audio" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "coverPhoto",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Audio_created_by_idx" ON "Audio"("created_by");

-- CreateIndex
CREATE INDEX "Photo_created_by_idx" ON "Photo"("created_by");

-- CreateIndex
CREATE INDEX "Video_created_by_idx" ON "Video"("created_by");

-- AddForeignKey
ALTER TABLE "Audio" ADD CONSTRAINT "Audio_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
