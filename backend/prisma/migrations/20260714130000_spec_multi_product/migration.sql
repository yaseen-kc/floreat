-- AlterTable
ALTER TABLE "Spec" DROP COLUMN "description",
                   DROP COLUMN "specifications",
                   DROP COLUMN "makeOrBrand",
                   DROP COLUMN "yieldStrengthMpa";

-- CreateTable
CREATE TABLE "SpecProduct" (
    "id" TEXT NOT NULL,
    "specId" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "specification" TEXT,
    "makeOrBrand" TEXT,
    "yieldStrengthMpa" INTEGER,

    CONSTRAINT "SpecProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpecProduct_specId_code_key" ON "SpecProduct"("specId", "code");

-- AddForeignKey
ALTER TABLE "SpecProduct" ADD CONSTRAINT "SpecProduct_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;
