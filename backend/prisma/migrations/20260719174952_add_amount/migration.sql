-- CreateEnum
CREATE TYPE "AmountUnit" AS ENUM ('KG', 'RM', 'SQM', 'NOS');

-- CreateTable
CREATE TABLE "Amount" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Amount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmountItem" (
    "id" TEXT NOT NULL,
    "amountId" TEXT NOT NULL,
    "description" TEXT,
    "unit" "AmountUnit",
    "quantity" DECIMAL(10,3),
    "rateFabrication" DECIMAL(10,3),
    "rateErection" DECIMAL(10,3),
    "rateLoading" DECIMAL(10,3),
    "amountFabrication" DECIMAL(10,3),
    "amountErection" DECIMAL(10,3),
    "amountLoading" DECIMAL(10,3),

    CONSTRAINT "AmountItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Amount_jobId_key" ON "Amount"("jobId");

-- CreateIndex
CREATE INDEX "Amount_createdAt_idx" ON "Amount"("createdAt");

-- CreateIndex
CREATE INDEX "AmountItem_amountId_idx" ON "AmountItem"("amountId");

-- AddForeignKey
ALTER TABLE "Amount" ADD CONSTRAINT "Amount_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmountItem" ADD CONSTRAINT "AmountItem_amountId_fkey" FOREIGN KEY ("amountId") REFERENCES "Amount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
