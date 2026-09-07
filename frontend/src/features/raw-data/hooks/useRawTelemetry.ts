import { useCallback, useEffect, useState } from 'react';
import { fetchRawTelemetry } from '../api/telemetryApi';
import type { RawTelemetryRow } from '../types/telemetry';

export const useRawTelemetry = (deviceId: string, autoRefresh: boolean) => {
  const [data, setData] = useState<RawTelemetryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchRawTelemetry(deviceId || undefined, 50);
      if (response.success) setData(response.data);
      setLastFetched(new Date());
    } catch (error) {
      console.error('Gagal mengambil data telemetri:', error);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, load]);

  return { data, isLoading, lastFetched, refetch: load };
};
