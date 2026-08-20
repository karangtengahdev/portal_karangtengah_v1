export type HarvestItem = {
  id: string;
  farmerName: string;
  fieldName: string | null;
  ubinanKg: number;
  areaHa: number;
  yieldTonHa: number;
  estimatedKg: number;
  pestLossPct: number;
  scheduleId: string | null;
  padukuhan: string;
  harvestDate: string;
  createdAt: string;
};

// Response dari GET /v1/cms/harvest mengembalikan array di dalam "data"
export type HarvestResponse = {
  success: boolean;
  data: HarvestItem[];
};

export type SingleHarvestResponse = {
  success: boolean;
  data: HarvestItem;
};

export type HarvestPayload = {
  farmerName: string;
  fieldName?: string;
  padukuhan: string;
  ubinanKg: number;
  areaHa: number;
  pestLossPct: number;
  harvestDate: string; // Format YYYY-MM-DD
  scheduleId?: string; 
};