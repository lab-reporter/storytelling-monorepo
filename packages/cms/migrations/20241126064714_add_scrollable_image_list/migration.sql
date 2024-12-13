-- CreateTable
CREATE TABLE "ScrollableImage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "editorState" JSONB DEFAULT '{"captions":[],"imgObjs":[]}',

    CONSTRAINT "ScrollableImage_pkey" PRIMARY KEY ("id")
);
