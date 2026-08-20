import type { ConnectionStatus, DeviceStatus } from '../data/monitoringMapData';

const statusClassByDeviceStatus: Record<DeviceStatus, string> = {
  moving: 'border-[#DCEBFF] bg-[#DCEBFF] text-[#1D6FD0]',
  online: 'border-[#DFF1D8] bg-[#EAF6E5] text-[#2F6D18]',
  warning: 'border-[#FFE3A3] bg-[#FFF0CB] text-[#B76B00]',
};

const connectionClassByStatus: Record<ConnectionStatus, string> = {
  check: 'text-[#EF4141]',
  online: 'text-[#138A50]',
};

export const StatusBadge = ({
  label,
  status,
}: {
  label: string;
  status: DeviceStatus;
}) => (
  <span
    className={`inline-flex min-w-[74px] justify-center rounded-full border px-3 py-1 text-xs font-bold ${statusClassByDeviceStatus[status]}`}
  >
    {label}
  </span>
);

export const ConnectionBadge = ({
  status,
}: {
  status: ConnectionStatus;
}) => {
  const isOnline = status === 'online';

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold ${connectionClassByStatus[status]}`}
    >
      <span
        className={[
          'h-2 w-2 rounded-full',
          isOnline ? 'bg-[#1DBE75]' : 'bg-[#EF4141]',
        ].join(' ')}
      />
      {isOnline ? 'Online' : 'Perlu Cek'}
    </span>
  );
};
