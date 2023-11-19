-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "server_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverId" INTEGER,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE SET NULL ON UPDATE CASCADE;
