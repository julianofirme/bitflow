/*
  Warnings:

  - Added the required column `amount_btc` to the `wallets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "amount_btc" DOUBLE PRECISION NOT NULL;
