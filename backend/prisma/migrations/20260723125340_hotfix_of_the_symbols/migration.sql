/*
  Warnings:

  - The values [CUT-OUT] on the enum `AreaDeductionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PRE-GALVANISED] on the enum `PurlinsGirtsFinish` will be removed. If these variants are still used in the database, this will fail.
  - The values [A-1,B-1,B-2,C-1,D-1,G-1,H-1,I-1,K-1,L-1] on the enum `RoofJointId` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AreaDeductionType_new" AS ENUM ('LIFT', 'DUCT', 'CUT_OUT');
ALTER TABLE "AreaDeduction" ALTER COLUMN "type" TYPE "AreaDeductionType_new" USING ("type"::text::"AreaDeductionType_new");
ALTER TYPE "AreaDeductionType" RENAME TO "AreaDeductionType_old";
ALTER TYPE "AreaDeductionType_new" RENAME TO "AreaDeductionType";
DROP TYPE "public"."AreaDeductionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PurlinsGirtsFinish_new" AS ENUM ('PRE_GALVANISED');
ALTER TABLE "Accessories" ALTER COLUMN "purlinsGirtsFinish" TYPE "PurlinsGirtsFinish_new" USING ("purlinsGirtsFinish"::text::"PurlinsGirtsFinish_new");
ALTER TYPE "PurlinsGirtsFinish" RENAME TO "PurlinsGirtsFinish_old";
ALTER TYPE "PurlinsGirtsFinish_new" RENAME TO "PurlinsGirtsFinish";
DROP TYPE "public"."PurlinsGirtsFinish_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RoofJointId_new" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'A_1', 'B_1', 'B_2', 'C_1', 'D_1', 'G_1', 'H_1', 'I_1', 'K_1', 'L_1');
ALTER TABLE "JointBoltRoof" ALTER COLUMN "roofJointId" TYPE "RoofJointId_new" USING ("roofJointId"::text::"RoofJointId_new");
ALTER TYPE "RoofJointId" RENAME TO "RoofJointId_old";
ALTER TYPE "RoofJointId_new" RENAME TO "RoofJointId";
DROP TYPE "public"."RoofJointId_old";
COMMIT;
