-- Accessories: the six *Quantity columns become server-derived Decimal values
-- (see @floreat/shared/calc deriveAccessoryQuantities). Int → Decimal(10,3) is a
-- widening, data-preserving cast.
ALTER TABLE "Accessories" ALTER COLUMN "gutterQuantity" SET DATA TYPE DECIMAL(10,3) USING "gutterQuantity"::decimal(10,3);
ALTER TABLE "Accessories" ALTER COLUMN "downTakeQuantity" SET DATA TYPE DECIMAL(10,3) USING "downTakeQuantity"::decimal(10,3);
ALTER TABLE "Accessories" ALTER COLUMN "dripTrimQuantity" SET DATA TYPE DECIMAL(10,3) USING "dripTrimQuantity"::decimal(10,3);
ALTER TABLE "Accessories" ALTER COLUMN "gableEndFlashingQuantity" SET DATA TYPE DECIMAL(10,3) USING "gableEndFlashingQuantity"::decimal(10,3);
ALTER TABLE "Accessories" ALTER COLUMN "cornerFlashQuantity" SET DATA TYPE DECIMAL(10,3) USING "cornerFlashQuantity"::decimal(10,3);
ALTER TABLE "Accessories" ALTER COLUMN "ridgeQuantity" SET DATA TYPE DECIMAL(10,3) USING "ridgeQuantity"::decimal(10,3);
