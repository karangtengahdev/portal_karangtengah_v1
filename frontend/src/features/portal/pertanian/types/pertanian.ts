export type PublicHarvestItem = {
  id: string;
  farmerName: string;
  fieldName: string | null;
  padukuhan: string;
  yieldTonHa: number;
  harvestDate: string;
  pestLossPct: number;
};

export type PadukuhanStat = {
  padukuhan: string;
  count: number;
  avgYieldTonHa: number;
};

export type PublicHarvestStats = {
  totalRecords: number;
  avgYieldTonHa: number;
  totalEstimatedKg: number;
  avgPestLossPct: number;
  byPadukuhan: PadukuhanStat[];
};

export type PublicHarvestResponse = {
  success: boolean;
  data: PublicHarvestItem[];
};

export type PublicHarvestStatsResponse = {
  success: boolean;
  data: PublicHarvestStats;
};