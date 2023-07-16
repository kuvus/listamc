/*
  Warnings:

  - The primary key for the `Server` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Server` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `server_id` on the `Promotion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `server_id` on the `ServerData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `server_id` on the `ServerMetadata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `server_id` on the `Vote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_server_id_fkey";

-- DropForeignKey
ALTER TABLE "ServerData" DROP CONSTRAINT "ServerData_server_id_fkey";

-- DropForeignKey
ALTER TABLE "ServerMetadata" DROP CONSTRAINT "ServerMetadata_server_id_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_server_id_fkey";

-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "server_id",
ADD COLUMN     "server_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Server" DROP CONSTRAINT "Server_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Server_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ServerData" DROP COLUMN "server_id",
ADD COLUMN     "server_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ServerMetadata" DROP COLUMN "server_id",
ADD COLUMN     "server_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "server_id",
ADD COLUMN     "server_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_server_id_key" ON "Promotion"("server_id");

-- CreateIndex
CREATE UNIQUE INDEX "ServerData_server_id_key" ON "ServerData"("server_id");

-- CreateIndex
CREATE UNIQUE INDEX "ServerMetadata_server_id_key" ON "ServerMetadata"("server_id");

-- AddForeignKey
ALTER TABLE "ServerData" ADD CONSTRAINT "ServerData_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMetadata" ADD CONSTRAINT "ServerMetadata_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
