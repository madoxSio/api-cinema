/*
  Warnings:

  - Added the required column `nb_ticket` to the `Screening` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "nb_ticket" INTEGER NOT NULL;
