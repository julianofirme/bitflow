/*
  Warnings:

  - You are about to drop the `balances` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password_hash` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `salt` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "balances" DROP CONSTRAINT "balances_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL,
ALTER COLUMN "salt" SET NOT NULL;

-- DropTable
DROP TABLE "balances";

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
