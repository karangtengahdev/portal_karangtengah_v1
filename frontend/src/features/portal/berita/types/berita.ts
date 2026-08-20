export type PublicBeritaItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverUrl: string | null;
  publishedAt: string;
  
  category?: string;
  views?: number;
  author?: string;
};

export type PublicBeritaResponse = {
  success: boolean;
  data: PublicBeritaItem[] | { items: PublicBeritaItem[] };
};

export type SinglePublicBeritaResponse = {
  success: boolean;
  data: PublicBeritaItem;
};