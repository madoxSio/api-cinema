/*
  Warnings:

  - You are about to drop the column `cinemaHallId` on the `CinemaHallPhoto` table. All the data in the column will be lost.
  - You are about to drop the `CinemaHall` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `movieTheaterId` to the `CinemaHallPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CinemaHallPhoto" DROP CONSTRAINT "CinemaHallPhoto_cinemaHallId_fkey";

-- AlterTable
ALTER TABLE "CinemaHallPhoto" DROP COLUMN "cinemaHallId",
ADD COLUMN     "movieTheaterId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CinemaHall";

-- CreateTable
CREATE TABLE "MovieTheater" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "hasDisabledAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieTheater_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CinemaHallPhoto" ADD CONSTRAINT "CinemaHallPhoto_movieTheaterId_fkey" FOREIGN KEY ("movieTheaterId") REFERENCES "MovieTheater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
