/*
  Warnings:

  - Added the required column `date_end` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_start` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "date_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "date_start" TIMESTAMP(3) NOT NULL;
