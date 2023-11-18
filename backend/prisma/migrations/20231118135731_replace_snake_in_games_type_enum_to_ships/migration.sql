/*
  Warnings:

  - The values [CHECKERS] on the enum `GameType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameType_new" AS ENUM ('SNAKE', 'CHESS', 'SHIPS');
ALTER TABLE "rankings" ALTER COLUMN "game" TYPE "GameType_new" USING ("game"::text::"GameType_new");
ALTER TABLE "match_histories" ALTER COLUMN "game" TYPE "GameType_new" USING ("game"::text::"GameType_new");
ALTER TYPE "GameType" RENAME TO "GameType_old";
ALTER TYPE "GameType_new" RENAME TO "GameType";
DROP TYPE "GameType_old";
COMMIT;
