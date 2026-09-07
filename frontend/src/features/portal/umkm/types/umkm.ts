export type PublicUmkmItem = {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  category: string;
  coverUrl: string | null;
  contactPhone: string;
};

export type PublicUmkmResponse = {
  success: boolean;
  data: {
    items: PublicUmkmItem[];
    total: number;
    page: number;
    limit: number;
  };
};

// ── Detail (baru) ──────────────────────────────────────────────

export type PublicUmkmProduct = {
  name: string;
  price: number;
  unit: string;
  stock: number;
  note?: string;
  photoUrl?: string | null;
};

export type PublicUmkmDetail = {
  id: string;
  name: string;
  slug: string;
  ownerName: string | null;
  description: string | null;
  category: string | null;
  coverUrl: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  products: PublicUmkmProduct[];
};

export type SinglePublicUmkmResponse = {
  success: boolean;
  data: PublicUmkmDetail;
};
