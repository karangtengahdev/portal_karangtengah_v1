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