/*
  Warnings:

  - You are about to drop the `Serverdata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Serverhistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Serverdata" DROP CONSTRAINT "Serverdata_server_id_fkey";

-- DropTable
DROP TABLE "Serverdata";

-- DropTable
DROP TABLE "Serverhistory";

-- CreateTable
CREATE TABLE "ServerData" (
    "id" TEXT NOT NULL,
    "server_id" TEXT NOT NULL,
    "players_online" INTEGER NOT NULL,
    "players_max" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "motd" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "ServerData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerHistory" (
    "id" TEXT NOT NULL,
    "server_id" TEXT NOT NULL,
    "players" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServerData" ADD CONSTRAINT "ServerData_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
