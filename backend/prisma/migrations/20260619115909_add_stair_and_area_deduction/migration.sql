-- CreateEnum
CREATE TYPE "StairStepType" AS ENUM ('6MM CHQ PLATE', '4MM CHQ PLATE', 'TUBE');

-- CreateEnum
CREATE TYPE "StairFloorLevel" AS ENUM ('GROUND', 'FIRST FLOOR', 'SECOND FLOOR', 'THIRD FLOOR', 'FOURTH FLOOR', 'FIFTH FLOOR', 'SIXTH FLOOR');

-- CreateEnum
CREATE TYPE "StairStringerType" AS ENUM ('HR SECTION', 'FAB SECTION');

-- CreateEnum
CREATE TYPE "AreaDeductionType" AS ENUM ('LIFT', 'DUCT', 'CUT-OUT');

-- CreateEnum
CREATE TYPE "AreaDeductionFor" AS ENUM ('STRUCTURE DEDUCTION', 'COVERING DEDUCTION', 'BOTH');

-- CreateTable
CREATE TABLE "Stair" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StairItem" (
    "id" TEXT NOT NULL,
    "stairId" TEXT NOT NULL,
    "code" TEXT,
    "typeOfStep" "StairStepType",
    "location" TEXT,
    "startingFrom" "StairFloorLevel",
    "endingUpTo" "StairFloorLevel",
    "length" DECIMAL(10,3),
    "width" DECIMAL(10,3),
    "height" DECIMAL(10,3),
    "numberOfMidLanding" INTEGER,
    "typeOfStringer" "StairStringerType",
    "unitWeightOfStringer" DECIMAL(10,3),

    CONSTRAINT "StairItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaDeduction" (
    "id" TEXT NOT NULL,
    "stairId" TEXT NOT NULL,
    "type" "AreaDeductionType",
    "location" TEXT,
    "areaM2" DECIMAL(10,3),
    "numbers" INTEGER,
    "deductionFor" "AreaDeductionFor",

    CONSTRAINT "AreaDeduction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stair_jobId_key" ON "Stair"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "StairItem_stairId_code_key" ON "StairItem"("stairId", "code");

-- AddForeignKey
ALTER TABLE "Stair" ADD CONSTRAINT "Stair_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StairItem" ADD CONSTRAINT "StairItem_stairId_fkey" FOREIGN KEY ("stairId") REFERENCES "Stair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaDeduction" ADD CONSTRAINT "AreaDeduction_stairId_fkey" FOREIGN KEY ("stairId") REFERENCES "Stair"("id") ON DELETE CASCADE ON UPDATE CASCADE;
