/*
  Warnings:

  - Changed the type of `game` on the `match_histories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `game` on the `rankings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('SNAKE', 'CHESS', 'CHECKERS');

-- AlterTable
ALTER TABLE "match_histories" DROP COLUMN "game",
ADD COLUMN     "game" "GameType" NOT NULL;

-- AlterTable
ALTER TABLE "rankings" DROP COLUMN "game",
ADD COLUMN     "game" "GameType" NOT NULL;

-- DropEnum
DROP TYPE "Game";
