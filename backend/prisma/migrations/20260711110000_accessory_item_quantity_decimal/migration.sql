-- Accessory line-item `quantity` becomes a server-derived Decimal (dimA * dimB * nos).
-- Int -> Decimal(10,3) is a widening, data-preserving cast.
ALTER TABLE "AccessoryDoor" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,3) USING "quantity"::decimal(10,3);
ALTER TABLE "AccessoryWindow" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,3) USING "quantity"::decimal(10,3);
ALTER TABLE "AccessoryFoldedPlate" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,3) USING "quantity"::decimal(10,3);
ALTER TABLE "AccessoryOpening" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,3) USING "quantity"::decimal(10,3);
