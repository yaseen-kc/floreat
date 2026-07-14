-- CreateTable
CREATE TABLE "Spec" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specifications" TEXT[],
    "makeOrBrand" TEXT[],
    "yieldStrengthMpa" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spec_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Spec_description_idx" ON "Spec"("description");
