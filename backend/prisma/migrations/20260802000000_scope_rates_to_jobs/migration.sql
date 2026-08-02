-- Existing global rates are disposable seed data. Remove them before making
-- the new ownership column mandatory.
DELETE FROM "Rate";

DROP INDEX "Rate_item_key";

ALTER TABLE "Rate" ADD COLUMN "jobId" TEXT NOT NULL;

ALTER TABLE "Rate"
  ADD CONSTRAINT "Rate_jobId_fkey"
  FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Rate_jobId_item_key" ON "Rate"("jobId", "item");
CREATE INDEX "Rate_jobId_idx" ON "Rate"("jobId");
CREATE INDEX "Rate_jobId_createdAt_idx" ON "Rate"("jobId", "createdAt");
