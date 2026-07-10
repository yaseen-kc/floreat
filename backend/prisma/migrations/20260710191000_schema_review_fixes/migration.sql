-- Schema review fixes (SCHEMA.md): C1, C2, H1, H2, H3, M1, M2, M4, L2, L3.
-- Hand-written to PRESERVE DATA where Prisma's auto-diff would drop/recreate:
--   • Dia* columns are RENAMED (not dropped) — keeps existing values.
--   • gutter/downTake/flashing are CAST enum→boolean (YES→true, NO→false).
--   • Job.userId is added nullable, BACKFILLED, then set NOT NULL + FK.
-- Review the backfill target before applying to a populated database.

-- ── C2: User.email unique ───────────────────────────────────────────────────
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- ── C1: Job ownership ───────────────────────────────────────────────────────
-- 1) add nullable, 2) backfill existing rows to an existing user, 3) enforce.
ALTER TABLE "Job" ADD COLUMN "userId" TEXT;
UPDATE "Job"
   SET "userId" = (SELECT "clerkId" FROM "User" ORDER BY "createdAt" ASC LIMIT 1)
 WHERE "userId" IS NULL;
ALTER TABLE "Job" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Job"
  ADD CONSTRAINT "Job_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("clerkId")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ── L2/L3: Job column types (safe casts) ────────────────────────────────────
ALTER TABLE "Job" ALTER COLUMN "projectNo" SET DATA TYPE VARCHAR(50);
ALTER TABLE "Job" ALTER COLUMN "refNo" SET DATA TYPE VARCHAR(50);
ALTER TABLE "Job" ALTER COLUMN "designedByMobile" SET DATA TYPE VARCHAR(20);
ALTER TABLE "Job" ALTER COLUMN "estimationEngineerMobile" SET DATA TYPE VARCHAR(20);
ALTER TABLE "Job" ALTER COLUMN "headOfSalesMobile" SET DATA TYPE VARCHAR(20);
ALTER TABLE "Job" ALTER COLUMN "date" SET DATA TYPE DATE USING "date"::date;

-- ── H2/C1: Job indexes ──────────────────────────────────────────────────────
CREATE INDEX "Job_userId_idx" ON "Job"("userId");
CREATE INDEX "Job_userId_createdAt_idx" ON "Job"("userId", "createdAt");

-- ── M1: rename Roof SAG-rod columns (preserve data) ─────────────────────────
ALTER TABLE "Roof" RENAME COLUMN "DiaOfRoofSagRod" TO "diaOfRoofSagRod";
ALTER TABLE "Roof" RENAME COLUMN "DiaOfCladdingSagRod" TO "diaOfCladdingSagRod";

-- ── H3: roofFrameBaseFixing nullable ────────────────────────────────────────
ALTER TABLE "Roof" ALTER COLUMN "roofFrameBaseFixing" DROP NOT NULL;

-- ── H2: Roof createdAt index ────────────────────────────────────────────────
CREATE INDEX "Roof_createdAt_idx" ON "Roof"("createdAt");

-- ── M2: CanopyItem YesNo → Boolean (preserve semantics) ─────────────────────
ALTER TABLE "CanopyItem"
  ALTER COLUMN "gutter" TYPE BOOLEAN
  USING (CASE "gutter"::text WHEN 'YES' THEN true WHEN 'NO' THEN false ELSE NULL END);
ALTER TABLE "CanopyItem"
  ALTER COLUMN "downTake" TYPE BOOLEAN
  USING (CASE "downTake"::text WHEN 'YES' THEN true WHEN 'NO' THEN false ELSE NULL END);
ALTER TABLE "CanopyItem"
  ALTER COLUMN "flashing" TYPE BOOLEAN
  USING (CASE "flashing"::text WHEN 'YES' THEN true WHEN 'NO' THEN false ELSE NULL END);

-- Drop the now-unused enum type.
DROP TYPE "YesNo";

-- ── H2: remaining createdAt indexes ─────────────────────────────────────────
CREATE INDEX "Canopy_createdAt_idx" ON "Canopy"("createdAt");
CREATE INDEX "Mezzanine_createdAt_idx" ON "Mezzanine"("createdAt");
CREATE INDEX "Stair_createdAt_idx" ON "Stair"("createdAt");
CREATE INDEX "Load_createdAt_idx" ON "Load"("createdAt");
CREATE INDEX "Accessories_createdAt_idx" ON "Accessories"("createdAt");

-- ── H1: foreign-key indexes on pure 1-to-many children ──────────────────────
CREATE INDEX "MezzanineFloorExtension_mezzanineId_idx" ON "MezzanineFloorExtension"("mezzanineId");
CREATE INDEX "AreaDeduction_stairId_idx" ON "AreaDeduction"("stairId");
CREATE INDEX "AccessoryDoor_accessoriesId_idx" ON "AccessoryDoor"("accessoriesId");
CREATE INDEX "AccessoryWindow_accessoriesId_idx" ON "AccessoryWindow"("accessoriesId");
CREATE INDEX "AccessoryFoldedPlate_accessoriesId_idx" ON "AccessoryFoldedPlate"("accessoriesId");
CREATE INDEX "AccessoryOpening_accessoriesId_idx" ON "AccessoryOpening"("accessoriesId");
