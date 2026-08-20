-- CreateEnum
CREATE TYPE "StatusMusimTanam" AS ENUM ('DRAFT', 'AKTIF', 'SELESAI');

-- CreateTable
CREATE TABLE "komoditas" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "komoditas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musim_tanam" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "komoditas_id" UUID NOT NULL,
    "lokasi" TEXT,
    "tanggal_mulai" TIMESTAMPTZ,
    "tanggal_selesai" TIMESTAMPTZ,
    "status" "StatusMusimTanam" NOT NULL DEFAULT 'DRAFT',
    "created_by_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "musim_tanam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tahapan_jadwal" (
    "id" UUID NOT NULL,
    "musim_tanam_id" UUID NOT NULL,
    "nama_tahapan" TEXT NOT NULL,
    "tanggal_mulai" TIMESTAMPTZ NOT NULL,
    "tanggal_selesai" TIMESTAMPTZ,
    "urutan" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tahapan_jadwal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "musim_tanam_status_idx" ON "musim_tanam"("status");

-- CreateIndex
CREATE INDEX "tahapan_jadwal_musim_tanam_id_urutan_idx" ON "tahapan_jadwal"("musim_tanam_id", "urutan");

-- AddForeignKey
ALTER TABLE "musim_tanam" ADD CONSTRAINT "musim_tanam_komoditas_id_fkey" FOREIGN KEY ("komoditas_id") REFERENCES "komoditas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musim_tanam" ADD CONSTRAINT "musim_tanam_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tahapan_jadwal" ADD CONSTRAINT "tahapan_jadwal_musim_tanam_id_fkey" FOREIGN KEY ("musim_tanam_id") REFERENCES "musim_tanam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
