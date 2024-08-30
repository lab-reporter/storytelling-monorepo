-- AlterTable
ALTER TABLE "ScrollableThreeModel" ADD COLUMN     "created_by" INTEGER;

-- AlterTable
ALTER TABLE "ScrollableVideo" ADD COLUMN     "created_by" INTEGER;

-- CreateIndex
CREATE INDEX "ScrollableThreeModel_created_by_idx" ON "ScrollableThreeModel"("created_by");

-- CreateIndex
CREATE INDEX "ScrollableVideo_created_by_idx" ON "ScrollableVideo"("created_by");

-- AddForeignKey
ALTER TABLE "ScrollableThreeModel" ADD CONSTRAINT "ScrollableThreeModel_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrollableVideo" ADD CONSTRAINT "ScrollableVideo_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
