// ── Entitas dasar ─────────────────────────────────────────────
export type Komoditas = {
  id: string;
  nama: string;
  deskripsi: string | null;
};

export type TahapanJadwal = {
  id: string;
  musimTanamId: string;
  namaTahapan: string;
  tanggalMulai: string;
  tanggalSelesai: string | null;
  urutan: number;
  deskripsi: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MusimTanam = {
  id: string;
  judul: string;
  komoditasId: string;
  lokasi: string | null;
  tanggalMulai: string | null;
  tanggalSelesai: string | null;
  status: 'DRAFT' | 'AKTIF' | 'SELESAI';
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  komoditas: Komoditas;
  tahapan: TahapanJadwal[];
};

// ── Response shapes ────────────────────────────────────────────
export type ListMusimTanamResponse = {
  success: boolean;
  data: MusimTanam[];
};

export type SingleMusimTanamResponse = {
  success: boolean;
  data: MusimTanam;
};

export type ListKomoditasResponse = {
  success: boolean;
  data: Komoditas[];
};

// ── Payload types (dipakai di API + modal forms) ───────────────
export type CreateMusimTanamPayload = {
  judul: string;
  komoditasId: string;
  lokasi?: string;
  tanggalMulai?: string;   // ISO 8601, contoh "2026-09-01T00:00:00.000Z"
  tanggalSelesai?: string; // ISO 8601
  status?: 'DRAFT' | 'AKTIF' | 'SELESAI';
};

export type UpdateMusimTanamPayload = Partial<CreateMusimTanamPayload>;

export type CreateTahapanPayload = {
  namaTahapan: string;
  tanggalMulai: string;    // ISO 8601
  tanggalSelesai?: string; // ISO 8601
  urutan: number;
  deskripsi?: string;
};

export type UpdateTahapanPayload = Partial<CreateTahapanPayload>;
