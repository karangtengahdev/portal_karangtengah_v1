export type PublicPadukuhanGalleryItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
  orderIndex: number;
};

export type PublicPadukuhanItem = {
  id: string;
  name: string;
  kepalaDukuh: string | null;
  sambutan: string | null;
  description: string | null;
  hasData: boolean;
  orderIndex: number;
  gallery: PublicPadukuhanGalleryItem[];
};

export type PublicPadukuhanResponse = {
  success: boolean;
  data: PublicPadukuhanItem[];
};
