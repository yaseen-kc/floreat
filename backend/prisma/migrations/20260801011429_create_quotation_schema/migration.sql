-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "approvalDrawingDays" INTEGER,
    "approvalDrawingUnit" "ApprovalDrawingsTimeUnit",
    "deliveryDays" INTEGER,
    "completionDays" INTEGER,
    "commencementDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_jobId_key" ON "Quotation"("jobId");

-- CreateIndex
CREATE INDEX "Quotation_createdAt_idx" ON "Quotation"("createdAt");

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
