/*
  Warnings:

  - The `code` column on the `StairItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- The first failed attempt left this enum behind even though the migration
-- itself was rolled back. Keep recovery idempotent for that state.
DO $$
BEGIN
  CREATE TYPE "StairCode" AS ENUM ('STAIR-1', 'STAIR-2', 'STAIR-3', 'STAIR-4', 'STAIR-5', 'STAIR-6', 'STAIR-7', 'STAIR-8', 'STAIR-9', 'STAIR-10', 'STAIR-11', 'STAIR-12');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- Preserve existing textual identifiers while upgrading the column type.
ALTER TABLE "StairItem"
  ALTER COLUMN "code" TYPE "StairCode"
  USING CASE
    WHEN "code" IN ('STAIR-1','STAIR-2','STAIR-3','STAIR-4','STAIR-5','STAIR-6','STAIR-7','STAIR-8','STAIR-9','STAIR-10','STAIR-11','STAIR-12')
      THEN "code"::text::"StairCode"
    ELSE NULL
  END;

-- The composite unique index was created by the original stair migration and
-- remains valid while the nullable code column changes from text to enum.
