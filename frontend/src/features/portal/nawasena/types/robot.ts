export type RoverStatus = 'patrolling' | 'idle' | 'returning' | 'charging' | string;

export type RoverTrackPoint = {
  id: string;
  deviceId: string;
  lat: number;
  lng: number;
  heading: number;
  gpsFix: boolean;
  sats: number;
  status: RoverStatus;
  recordedAt: string;
};

export type RoverTrackResponse = {
  success: boolean;
  data: RoverTrackPoint[];
};