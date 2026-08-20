/*
  Warnings:

  - You are about to drop the column `images` on the `umkm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "umkm" DROP COLUMN "images",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "cover_url" TEXT;

-- CreateIndex
CREATE INDEX "umkm_category_idx" ON "umkm"("category");
