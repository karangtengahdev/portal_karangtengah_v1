import { useCallback, useEffect, useState } from 'react';
import { getRoverTrack } from '../api/apiRobot';
import type { RoverTrackPoint } from '../types/robot';

const POLLING_INTERVAL_MS = 5000;

export const useRoverTrack = (deviceId: string) => {
  const [latestPoint, setLatestPoint] = useState<RoverTrackPoint | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchTrack = useCallback(async () => {
    try {
      const response = await getRoverTrack(deviceId);
      const point = response.data?.[0];

      if (point) {
        setLatestPoint(point);
        setIsError(false);
      }
    } catch (error) {
      console.error('Gagal mengambil data rover:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchTrack();

    const intervalId = setInterval(fetchTrack, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [fetchTrack]);

  return { latestPoint, isLoading, isError, refetch: fetchTrack };
};