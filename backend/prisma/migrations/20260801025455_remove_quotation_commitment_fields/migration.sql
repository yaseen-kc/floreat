/*
  Warnings:

  - You are about to drop the column `approvalDrawingDays` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `approvalDrawingUnit` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `commencementDays` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `completionDays` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryDays` on the `Quotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "approvalDrawingDays",
DROP COLUMN "approvalDrawingUnit",
DROP COLUMN "commencementDays",
DROP COLUMN "completionDays",
DROP COLUMN "deliveryDays";
