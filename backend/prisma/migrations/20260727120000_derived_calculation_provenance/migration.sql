ALTER TABLE "Amount"
  ADD COLUMN "calculationVersion" TEXT NOT NULL DEFAULT 'amount-v1',
  ADD COLUMN "sourceUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "rateVersion" INTEGER,
  ADD COLUMN "isStale" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Quantity"
  ADD COLUMN "calculationVersion" TEXT NOT NULL DEFAULT 'quantity-v1',
  ADD COLUMN "sourceUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "rateVersion" INTEGER,
  ADD COLUMN "isStale" BOOLEAN NOT NULL DEFAULT false;
