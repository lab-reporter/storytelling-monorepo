-- CreateEnum
CREATE TYPE "PuzzlePhotoInfraDirectionType" AS ENUM ('horizontalScroll', 'verticalRectangleScroll');

-- AlterTable
ALTER TABLE "PuzzlePhotoInfra" DROP COLUMN "fitMode1",
DROP COLUMN "fitMode2",
DROP COLUMN "fitMode3",
DROP COLUMN "fitMode4",
DROP COLUMN "focusPosition1",
DROP COLUMN "focusPosition2",
DROP COLUMN "focusPosition3",
DROP COLUMN "focusPosition4",
DROP COLUMN "layout",
DROP COLUMN "photo1",
DROP COLUMN "photo2",
DROP COLUMN "photo3",
DROP COLUMN "photo4",
ADD COLUMN     "config" JSONB DEFAULT '{"photoCount":0,"photos":[],"hasPadding":true}',
ADD COLUMN     "direction" "PuzzlePhotoInfraDirectionType" NOT NULL DEFAULT 'horizontalScroll';

-- DropEnum
DROP TYPE "PuzzlePhotoInfraLayoutType";
