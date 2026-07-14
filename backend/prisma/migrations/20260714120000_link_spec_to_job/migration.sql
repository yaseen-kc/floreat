-- DropIndex
DROP INDEX "Spec_description_idx";

-- AlterTable
ALTER TABLE "Spec" ADD COLUMN "jobId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Spec_jobId_key" ON "Spec"("jobId");

-- CreateIndex
CREATE INDEX "Spec_createdAt_idx" ON "Spec"("createdAt");

-- AddForeignKey
ALTER TABLE "Spec" ADD CONSTRAINT "Spec_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
