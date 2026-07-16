-- CreateEnum
CREATE TYPE "RateUnit" AS ENUM ('KG', 'RM', 'SQM', 'NOS');

-- CreateTable
CREATE TABLE "Rate" (
    "id" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "unit" "RateUnit" NOT NULL,
    "material" DECIMAL(10,3),
    "fabrication" DECIMAL(10,3),
    "transportation" DECIMAL(10,3),
    "installation" DECIMAL(10,3),
    "loadingUnloading" DECIMAL(10,3),
    "overheads" DECIMAL(10,3),
    "others" DECIMAL(10,3),
    "marginPercentage" DECIMAL(10,3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rate_item_key" ON "Rate"("item");

-- CreateIndex
CREATE INDEX "Rate_createdAt_idx" ON "Rate"("createdAt");
