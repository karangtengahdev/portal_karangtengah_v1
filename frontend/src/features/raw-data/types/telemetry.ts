export type RawTelemetryRow = {
  id: string;
  deviceId: string;
  payload: {
    deviceId: string;
    type: string;
    data: Record<string, any>;
    recordedAt?: string;
  };
  recordedAt: string;
};

export type RawTelemetryResponse = {
  success: boolean;
  data: RawTelemetryRow[];
};
