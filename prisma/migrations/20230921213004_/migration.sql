/*
  Warnings:

  - You are about to drop the column `serverId` on the `Transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_serverId_fkey";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "serverId";

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
