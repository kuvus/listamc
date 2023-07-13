/*
  Warnings:

  - Added the required column `motd_text` to the `ServerData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServerData" ADD COLUMN     "motd_text" TEXT NOT NULL;
