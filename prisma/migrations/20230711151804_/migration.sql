/*
  Warnings:

  - A unique constraint covering the columns `[server_id]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_server_id_key" ON "Vote"("server_id");
