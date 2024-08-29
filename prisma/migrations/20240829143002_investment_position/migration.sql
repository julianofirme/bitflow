-- CreateTable
CREATE TABLE "investment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount_invested" DOUBLE PRECISION NOT NULL,
    "btc_price_at_purchase" DOUBLE PRECISION NOT NULL,
    "btc_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "investment_user_id_idx" ON "investment"("user_id");

-- AddForeignKey
ALTER TABLE "investment" ADD CONSTRAINT "investment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
