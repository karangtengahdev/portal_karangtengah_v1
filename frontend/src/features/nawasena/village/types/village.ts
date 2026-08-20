export type VillagePotency = {
  title: string;
  desc: string;
};

export type VillageStats = {
  area_ha: number;
  families: number;
  population: number;
  farmer_families?: number;
};

export type VillageGalleryItem = {
  id: string;
  imageUrl: string;
  caption: string;
  orderIndex: number;
  createdAt: string;
};

export type VillageItem = {
  id: string;
  vision: string | null;
  mission: string | null;
  description: string | null;
  potency: VillagePotency[] | null;
  stats: VillageStats | null;
  updatedAt: string;
  gallery: VillageGalleryItem[];
};

export type VillageResponse = {
  success: boolean;
  data: VillageItem;
};

export type VillagePayload = {
  vision: string;
  mission: string;
  description: string;
  potency: VillagePotency[];
  stats: Omit<VillageStats, 'farmer_families'>;
};

export type GalleryPayload = {
  imageUrl: string;
  caption: string;
  orderIndex: number;
};