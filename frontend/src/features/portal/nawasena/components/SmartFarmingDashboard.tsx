import { DeviceSummaryPanel } from './DeviceSummaryPanel';
import { FieldDevicesTable } from './FieldDevicesTable';
import { HarvestLossCard } from './HarvestLossCard';
import { MonitoringMap } from './MonitoringMap';
import { WeatherPanel } from './WeatherPanel';

export const SmartFarmingDashboard = () => {
  const handleRefreshWeather = () => undefined;

  return (
    <div className="bg-[#F7F8F3]">
      <section className="monitoring-map-section relative overflow-hidden bg-[#102A18]">
        <MonitoringMap fullBleed />

        {/* Panel cuaca — selalu absolute di atas map, mobile kanan atas kecil, desktop kanan tengah */}
        <div className="z-[720] absolute right-3 top-27 w-[200px] sm:right-4 sm:top-4 sm:w-[240px] lg:right-8 lg:top-[106px] lg:w-[330px] xl:right-10 xl:w-[350px] grid gap-3">
          <WeatherPanel onRefresh={handleRefreshWeather} compact />
          <div className="hidden lg:block">
            <DeviceSummaryPanel />
          </div>
        </div>
      </section>

      <section className="dashboard-bottom-section relative z-20 grid gap-4 border-t border-[rgba(31,65,38,0.08)] bg-[#FCFCF8] p-4 sm:p-5 lg:grid-cols-[minmax(280px,0.28fr)_minmax(0,0.72fr)]">
        <HarvestLossCard />
        <FieldDevicesTable />
      </section>
    </div>
  );
};