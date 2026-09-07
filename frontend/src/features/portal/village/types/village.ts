export type PublicVillageStats = {
  population: number;
  families: number;
  area_ha: number;
  farmer_families?: number;
};

export type PublicVillagePotency = {
  title: string;
  desc: string;
};

export type PublicVillageGalleryItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
  orderIndex: number;
};

export type PublicVillageProfile = {
  id: string;
  lurahName: string | null;
  vision: string | null;
  mission: string | null;
  description: string | null;
  potency: PublicVillagePotency[] | null;
  stats: PublicVillageStats | null;
  gallery: PublicVillageGalleryItem[];
};

export type PublicVillageResponse = {
  success: boolean;
  data: PublicVillageProfile;
};
