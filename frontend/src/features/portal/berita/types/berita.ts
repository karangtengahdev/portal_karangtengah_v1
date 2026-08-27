export type PublicBeritaItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
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