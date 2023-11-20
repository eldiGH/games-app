/*
  Warnings:

  - You are about to drop the `friendships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "friendships" DROP CONSTRAINT "friendships_friendId_fkey";

-- DropForeignKey
ALTER TABLE "friendships" DROP CONSTRAINT "friendships_playerId_fkey";

-- DropTable
DROP TABLE "friendships";
