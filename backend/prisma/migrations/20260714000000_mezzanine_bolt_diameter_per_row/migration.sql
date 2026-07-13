-- Move the mezzanine bolt diameter from the shared Joint.mezzanineBoltDiameter
-- column onto each JointBoltMezzanine row so every mezzanine joint carries its
-- own independent diameter (matching JointBoltRoof / FoundationBoltRoof).

-- AlterTable
ALTER TABLE "JointBoltMezzanine" ADD COLUMN "boltDiameter" DECIMAL(10,3);

-- AlterTable
ALTER TABLE "Joint" DROP COLUMN "mezzanineBoltDiameter";
