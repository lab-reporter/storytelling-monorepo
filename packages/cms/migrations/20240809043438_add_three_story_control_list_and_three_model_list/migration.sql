-- CreateTable
CREATE TABLE "ThreeStoryControl" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "modelSrc" TEXT NOT NULL DEFAULT '',
    "cameraHelperData" JSONB DEFAULT '{"plainPois":[],"animationClip":null,"modelObjs":[]}',

    CONSTRAINT "ThreeStoryControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreeModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "file_filesize" INTEGER,
    "file_filename" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ThreeModel_pkey" PRIMARY KEY ("id")
);
