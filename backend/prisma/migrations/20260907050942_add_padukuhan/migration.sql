-- DropIndex
DROP INDEX "asumsi_ekonomi_berlaku_sejak_idx";

-- AlterTable
ALTER TABLE "village_profile" ADD COLUMN     "lurah_name" TEXT;

-- CreateTable
CREATE TABLE "padukuhan" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "kepala_dukuh" TEXT,
    "sambutan" TEXT,
    "description" TEXT,
    "has_data" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "padukuhan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "padukuhan_gallery" (
    "id" UUID NOT NULL,
    "padukuhan_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "caption" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "padukuhan_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "padukuhan_name_key" ON "padukuhan"("name");

-- CreateIndex
CREATE INDEX "padukuhan_gallery_padukuhan_id_idx" ON "padukuhan_gallery"("padukuhan_id");

-- AddForeignKey
ALTER TABLE "padukuhan_gallery" ADD CONSTRAINT "padukuhan_gallery_padukuhan_id_fkey" FOREIGN KEY ("padukuhan_id") REFERENCES "padukuhan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
