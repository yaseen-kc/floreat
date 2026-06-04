-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "projectNo" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "refNo" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "designedByName" TEXT NOT NULL,
    "designedByMobile" TEXT NOT NULL,
    "clientName" TEXT,
    "estimationEngineerName" TEXT,
    "estimationEngineerMobile" TEXT,
    "headOfSalesName" TEXT,
    "headOfSalesMobile" TEXT,
    "firmName" TEXT,
    "buildingUsage" TEXT NOT NULL,
    "numberOfBuilding" INTEGER NOT NULL,
    "frameType" TEXT NOT NULL,
    "configuration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
