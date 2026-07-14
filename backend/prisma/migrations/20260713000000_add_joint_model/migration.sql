-- CreateEnum
CREATE TYPE "BoltType" AS ENUM ('HSFG', 'ORD');

-- CreateEnum
CREATE TYPE "RoofJointId" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'A-1', 'B-1', 'B-2', 'C-1', 'D-1', 'G-1', 'H-1', 'I-1', 'K-1', 'L-1');

-- CreateEnum
CREATE TYPE "MezzanineJointId" AS ENUM ('M', 'N', 'O', 'P', 'Q', 'R', 'S', 'SEC');

-- CreateEnum
CREATE TYPE "FoundationBoltJointId" AS ENUM ('FB4', 'FB5', 'FB6');

-- CreateTable
CREATE TABLE "Joint" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "mezzanineBoltDiameter" DECIMAL(10,3),
    "secondaryBeamsBoltType" "BoltType",
    "secondaryBeamsBoltDiameter" DECIMAL(10,3),
    "secondaryBeamsNumberOfBolts" INTEGER,
    "purlinFlangeBraceBoltType" "BoltType",
    "purlinFlangeBraceBoltDiameter" DECIMAL(10,3),
    "purlinFlangeBraceNumberOfBolts" INTEGER,
    "claddingPurlinsBoltType" "BoltType",
    "claddingPurlinsBoltDiameter" DECIMAL(10,3),
    "claddingPurlinsNumberOfBolts" INTEGER,
    "canopyBoltType" "BoltType",
    "canopyBoltDiameter" DECIMAL(10,3),
    "canopyNumberOfBolts" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Joint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JointBoltRoof" (
    "id" TEXT NOT NULL,
    "jointId" TEXT NOT NULL,
    "roofJointId" "RoofJointId" NOT NULL,
    "boltDiameter" DECIMAL(10,3),
    "numberOfBolts" INTEGER,

    CONSTRAINT "JointBoltRoof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JointBoltMezzanine" (
    "id" TEXT NOT NULL,
    "jointId" TEXT NOT NULL,
    "mezzanineJointId" "MezzanineJointId" NOT NULL,
    "numberOfBolts" INTEGER,

    CONSTRAINT "JointBoltMezzanine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoundationBoltRoof" (
    "id" TEXT NOT NULL,
    "jointId" TEXT NOT NULL,
    "foundationJointId" "FoundationBoltJointId" NOT NULL,
    "boltDiameter" DECIMAL(10,3),
    "numberOfBolts" INTEGER,

    CONSTRAINT "FoundationBoltRoof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Joint_createdAt_idx" ON "Joint"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Joint_jobId_key" ON "Joint"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "JointBoltRoof_jointId_roofJointId_key" ON "JointBoltRoof"("jointId", "roofJointId");

-- CreateIndex
CREATE UNIQUE INDEX "JointBoltMezzanine_jointId_mezzanineJointId_key" ON "JointBoltMezzanine"("jointId", "mezzanineJointId");

-- CreateIndex
CREATE UNIQUE INDEX "FoundationBoltRoof_jointId_foundationJointId_key" ON "FoundationBoltRoof"("jointId", "foundationJointId");

-- AddForeignKey
ALTER TABLE "Joint" ADD CONSTRAINT "Joint_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JointBoltRoof" ADD CONSTRAINT "JointBoltRoof_jointId_fkey" FOREIGN KEY ("jointId") REFERENCES "Joint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JointBoltMezzanine" ADD CONSTRAINT "JointBoltMezzanine_jointId_fkey" FOREIGN KEY ("jointId") REFERENCES "Joint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundationBoltRoof" ADD CONSTRAINT "FoundationBoltRoof_jointId_fkey" FOREIGN KEY ("jointId") REFERENCES "Joint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
