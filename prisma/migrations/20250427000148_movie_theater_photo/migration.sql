/*
  Warnings:

  - You are about to drop the `CinemaHallPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CinemaHallPhoto" DROP CONSTRAINT "CinemaHallPhoto_movieTheaterId_fkey";

-- DropTable
DROP TABLE "CinemaHallPhoto";

-- CreateTable
CREATE TABLE "MovieTheaterPhoto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "movieTheaterId" INTEGER NOT NULL,

    CONSTRAINT "MovieTheaterPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovieTheaterPhoto" ADD CONSTRAINT "MovieTheaterPhoto_movieTheaterId_fkey" FOREIGN KEY ("movieTheaterId") REFERENCES "MovieTheater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
