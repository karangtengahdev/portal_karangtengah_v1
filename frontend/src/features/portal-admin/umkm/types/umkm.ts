export type UmkmStatus = 'draft' | 'published' | 'archived';

export type UmkmProduct = {
  name: string;
  price: number;
  unit: string;
  stock: number;
  note?: string;
  photoUrl?: string | null;
};

export type UmkmItem = {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  description: string;
  category: string;
  coverUrl: string | null;
  contactPhone: string;
  contactAddress: string;
  products: UmkmProduct[];
  status: UmkmStatus;
  createdAt: string;
  updatedAt: string;
};

export type UmkmResponse = {
  success: boolean;
  data: {
    items: UmkmItem[];
    total: number;
    page: number;
    limit: number;
  };
};

export type SingleUmkmResponse = {
  success: boolean;
  data: UmkmItem;
};

export type UmkmPayload = {
  name: string;
  ownerName: string;
  description: string;
  category: string;
  contactPhone: string;
  contactAddress: string;
  coverUrl?: string;
  products: UmkmProduct[];
};