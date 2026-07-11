-- Accessories: per-field manual-override flags for the six server-derived
-- *Quantity columns. When a flag is true the client's own value is kept as-is
-- and the roof-driven recompute leaves that column untouched; the default false
-- preserves the existing server-derived behaviour for every existing row.
ALTER TABLE "Accessories" ADD COLUMN "gutterQuantityManual" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Accessories" ADD COLUMN "downTakeQuantityManual" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Accessories" ADD COLUMN "dripTrimQuantityManual" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Accessories" ADD COLUMN "gableEndFlashingQuantityManual" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Accessories" ADD COLUMN "cornerFlashQuantityManual" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Accessories" ADD COLUMN "ridgeQuantityManual" BOOLEAN NOT NULL DEFAULT false;
