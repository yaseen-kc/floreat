-- CreateEnum
CREATE TYPE "MezzanineFloorCodeExt" AS ENUM ('EXT-1', 'EXT-2', 'EXT-3');

-- Expand first, derive stable child identifiers, then remove the obsolete
-- display field. Existing row IDs and all other values remain untouched.
ALTER TABLE "MezzanineFloorExtension" ADD COLUMN "code" "MezzanineFloorCodeExt";
WITH numbered AS (
  SELECT "id", row_number() OVER (PARTITION BY "mezzanineId" ORDER BY "id") AS n
  FROM "MezzanineFloorExtension"
)
UPDATE "MezzanineFloorExtension" AS e
SET "code" = CASE numbered.n WHEN 1 THEN 'EXT-1'::"MezzanineFloorCodeExt" WHEN 2 THEN 'EXT-2'::"MezzanineFloorCodeExt" WHEN 3 THEN 'EXT-3'::"MezzanineFloorCodeExt" ELSE NULL END
FROM numbered
WHERE numbered."id" = e."id";
ALTER TABLE "MezzanineFloorExtension" DROP COLUMN "floor";
CREATE UNIQUE INDEX "MezzanineFloorExtension_mezzanineId_code_key" ON "MezzanineFloorExtension"("mezzanineId", "code");
