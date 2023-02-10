-- CreateEnum
CREATE TYPE "Game" AS ENUM ('SNAKE', 'CHESS', 'CHECKERS');

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(32) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "nickname" VARCHAR(20) NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rankings" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "game" "Game" NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_histories" (
    "id" SERIAL NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "winnerRatingBefore" INTEGER NOT NULL,
    "loserId" INTEGER NOT NULL,
    "loserRatingBefore" INTEGER NOT NULL,
    "transferedPoints" INTEGER NOT NULL,
    "game" "Game" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "players_email_key" ON "players"("email");

-- AddForeignKey
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_histories" ADD CONSTRAINT "match_histories_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_histories" ADD CONSTRAINT "match_histories_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
