-- CreateTable
CREATE TABLE "asumsi_ekonomi" (
    "id" UUID NOT NULL,
    "berlaku_sejak" DATE NOT NULL,
    "kerugian_baseline_min" DOUBLE PRECISION NOT NULL,
    "kerugian_baseline_maks" DOUBLE PRECISION NOT NULL,
    "kerugian_target" DOUBLE PRECISION NOT NULL,
    "harga_gabah_per_kg" INTEGER NOT NULL,
    "luas_pilot_ha" DOUBLE PRECISION NOT NULL,
    "luas_total_ha" DOUBLE PRECISION NOT NULL,
    "padukuhan_pilot" TEXT NOT NULL,
    "sumber" JSONB NOT NULL,
    "dicatat_oleh" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asumsi_ekonomi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asumsi_ekonomi_berlaku_sejak_idx" ON "asumsi_ekonomi"("berlaku_sejak");
