-- AlterTable
ALTER TABLE "Amount" ADD COLUMN     "flangeBraceErrectionAmount" DECIMAL(10,3),
ADD COLUMN     "flangeBraceErrectionRate" DECIMAL(10,3),
ADD COLUMN     "flangeBraceFabricationAmount" DECIMAL(10,3),
ADD COLUMN     "flangeBraceFabricationRate" DECIMAL(10,3),
ADD COLUMN     "flangeBraceLoadingAmount" DECIMAL(10,3),
ADD COLUMN     "flangeBraceLoadingRate" DECIMAL(10,3),
ADD COLUMN     "flangeBraceQuantity" DECIMAL(10,3);
