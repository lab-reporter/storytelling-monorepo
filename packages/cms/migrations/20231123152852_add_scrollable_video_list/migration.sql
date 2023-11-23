-- CreateTable
CREATE TABLE "ScrollableVideo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "mobileVideoUrl" TEXT NOT NULL DEFAULT '',
    "editorState" JSONB DEFAULT '{"captions":[],"video":{"sources":[{"mediaType":"video/mp4","src":""}]}}',

    CONSTRAINT "ScrollableVideo_pkey" PRIMARY KEY ("id")
);
