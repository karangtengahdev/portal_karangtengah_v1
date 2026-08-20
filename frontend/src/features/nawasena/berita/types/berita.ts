// Tipe data untuk CMS Berita (admin). Mengikuti pola types/umkm.ts.

// Kategori berita — sesuaikan kalau backend punya daftar berbeda.
export const BERITA_CATEGORIES = [
  'Berita',
  'Pengumuman',
  'Kegiatan',
  'Prestasi',
  'Artikel',
] as const;

export type BeritaStatus = 'draft' | 'published';

// Bentuk data berita yang dikembalikan backend (CMS).
export type BeritaItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category?: string | null;   // UI-only, tidak ada di DB schema
  author?: string | null;     // UI-only, tidak ada di DB schema
  coverUrl: string | null;
  status: BeritaStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Payload yang dikirim saat create/update (tanpa file — file diupload terpisah,
// pola sama seperti UMKM: simpan dulu, lalu upload cover ke /:id/cover)
export type BeritaPayload = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;   // diterima backend tapi tidak disimpan ke DB
  author?: string;     // diterima backend tapi tidak disimpan ke DB
};

// Bentuk response backend — dibungkus { success, data }, konsisten pola backend.
export type BeritaResponse = {
  success: boolean;
  data: { items: BeritaItem[] };
};

export type SingleBeritaResponse = {
  success: boolean;
  data: BeritaItem;
};
