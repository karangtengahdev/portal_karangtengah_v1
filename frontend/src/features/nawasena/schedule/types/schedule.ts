export type ScheduleStatus = 'planned' | 'planted' | 'harvested';

export type ScheduleItem = {
  id: string;
  farmerName: string;
  fieldName: string | null;
  padukuhan: string;
  plantDate: string;
  estimatedHarvest: string;
  status: ScheduleStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ScheduleResponse = {
  success: boolean;
  data: ScheduleItem[];
};

export type SingleScheduleResponse = {
  success: boolean;
  data: ScheduleItem;
};

export type SchedulePayload = {
  farmerName: string;
  fieldName?: string;
  padukuhan: string;
  plantDate: string; // Format YYYY-MM-DD
  estimatedHarvest: string; // Format YYYY-MM-DD
  cropDays: number;
  notes?: string;
};