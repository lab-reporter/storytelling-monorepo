/*
  Warnings:

  - You are about to drop the `ThreeStoryControl` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ThreeStoryControl";

-- CreateTable
CREATE TABLE "ScrollableThreeModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "modelSrc" TEXT NOT NULL DEFAULT '',
    "cameraHelperData" JSONB DEFAULT '{"plainPois":[],"animationClip":null,"modelObjs":[]}',

    CONSTRAINT "ScrollableThreeModel_pkey" PRIMARY KEY ("id")
);
