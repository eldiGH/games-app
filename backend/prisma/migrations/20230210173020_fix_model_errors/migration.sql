/*
  Warnings:

  - You are about to drop the column `registeredAt` on the `players` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `players` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "players" DROP COLUMN "registeredAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "players_nickname_key" ON "players"("nickname");
