-- CreateTable
CREATE TABLE "CinemaHall" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "hasDisabledAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CinemaHall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CinemaHallPhoto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "cinemaHallId" INTEGER NOT NULL,

    CONSTRAINT "CinemaHallPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CinemaHallPhoto" ADD CONSTRAINT "CinemaHallPhoto_cinemaHallId_fkey" FOREIGN KEY ("cinemaHallId") REFERENCES "CinemaHall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
