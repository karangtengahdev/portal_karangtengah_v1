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
