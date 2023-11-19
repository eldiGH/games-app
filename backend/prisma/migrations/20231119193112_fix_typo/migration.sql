/*
  Warnings:

  - You are about to drop the column `transferedPoints` on the `match_histories` table. All the data in the column will be lost.
  - Added the required column `transferredPoints` to the `match_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match_histories" DROP COLUMN "transferedPoints",
ADD COLUMN     "transferredPoints" INTEGER NOT NULL;
