/*
  Warnings:

  - Added the required column `online` to the `ServerData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServerData" ADD COLUMN     "online" BOOLEAN NOT NULL;
