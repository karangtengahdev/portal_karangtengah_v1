import { IconBug, IconLeaf, IconRobot } from '@tabler/icons-react';

import { devices, type FieldDevice } from '../data/monitoringMapData';
import { BatteryIndicator } from './BatteryIndicator';
import { ConnectionBadge, StatusBadge } from './StatusBadge';

const DeviceIcon = ({ device }: { device: FieldDevice }) => {
  const isRover = device.type === 'rover';
  const isWarning = device.status === 'warning';
  const Icon = isRover ? IconRobot : IconBug;

  return (
    <span
      className={[
        'grid h-8 w-8 shrink-0 place-items-center rounded-xl',
        isRover
          ? 'bg-[#DCEBFF] text-[#278AE8]'
          : isWarning
            ? 'bg-[#FFF0CB] text-[#B76B00]'
            : 'bg-[#EAF6E5] text-[#2F6D18]',
      ].join(' ')}
    >
      <Icon aria-hidden="true" size={17} stroke={1.8} />
    </span>
  );
};

export const FieldDevicesTable = () => (
  <article className="h-full overflow-hidden rounded-[26px] border border-[rgba(31,65,38,0.10)] bg-[#FCFCF8] p-6 text-[#182119] shadow-[0_8px_22px_rgba(22,42,25,0.06)]">
    <div className="flex items-center justify-between gap-4">
      <h2 className="inline-flex items-center gap-3 text-lg font-bold">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EAF6E5] text-[#2F6D18]">
          <IconLeaf aria-hidden="true" size={22} stroke={1.9} />
        </span>
        Perangkat Lapangan
      </h2>
    </div>

    <div className="mt-5 overflow-x-auto">
      <table
        aria-label="Tabel perangkat lapangan Nawasena"
        className="min-w-[760px] table-fixed border-collapse text-left text-sm"
      >
        <thead>
          <tr className="border-b border-[rgba(31,65,38,0.10)] text-xs font-semibold text-[#667067]">
            <th className="w-[20%] pb-3 pr-4 font-semibold">Perangkat</th>
            <th className="w-[18%] pb-3 pr-4 font-semibold">Lokasi</th>
            <th className="w-[15%] pb-3 pr-4 font-semibold">Status</th>
            <th className="w-[14%] pb-3 pr-4 font-semibold">Deteksi</th>
            <th className="w-[20%] pb-3 pr-4 font-semibold">Baterai / Sinyal</th>
            <th className="w-[13%] pb-3 font-semibold">Koneksi</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr
              className="h-[52px] border-b border-[rgba(31,65,38,0.08)] transition hover:bg-[#F2F6EE]"
              key={device.id}
            >
              <td className="pr-4">
                <div className="flex items-center gap-3">
                  <DeviceIcon device={device} />
                  <span className="font-bold">{device.name}</span>
                </div>
              </td>
              <td className="pr-4 text-[#4f5b52]">{device.location}</td>
              <td className="pr-4">
                <StatusBadge label={device.statusLabel} status={device.status} />
              </td>
              <td className="pr-4 text-[#4f5b52]">
                {device.detections ? `${device.detections} Deteksi` : '—'}
              </td>
              <td className="pr-4">
                <BatteryIndicator value={device.battery} />
              </td>
              <td>
                <ConnectionBadge status={device.connection} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </article>
);
