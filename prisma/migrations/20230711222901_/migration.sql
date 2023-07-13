/*
  Warnings:

  - A unique constraint covering the columns `[server_id]` on the table `ServerData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ServerData_server_id_key" ON "ServerData"("server_id");
