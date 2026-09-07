export type PadukuhanGalleryItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
  orderIndex: number;
  createdAt: string;
};

export type PadukuhanItem = {
  id: string;
  name: string;
  kepalaDukuh: string | null;
  sambutan: string | null;
  description: string | null;
  hasData: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  gallery: PadukuhanGalleryItem[];
};

export type PadukuhanResponse = {
  success: boolean;
  data: PadukuhanItem[];
};

export type SinglePadukuhanResponse = {
  success: boolean;
  data: PadukuhanItem;
};

export type PadukuhanPayload = {
  name: string;
  kepalaDukuh?: string;
  sambutan?: string;
  description?: string;
  hasData?: boolean;
  orderIndex?: number;
};
