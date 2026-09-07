import { useState } from 'react';
import { useRawTelemetry } from '../hooks/useRawTelemetry';

// Halaman TERSEMBUNYI -- tidak ada di navbar/menu mana pun, cuma bisa
// diakses lewat link langsung /raw-data. Sengaja @Public() di backend
// (tidak perlu login) supaya tim teknis robot bisa langsung cek tanpa
// perlu kredensial portal/nawasena -- trade-off: siapa pun yang tahu
// link ini bisa lihat datanya. Kalau nanti perlu lebih aman, tinggal
// tambah proteksi (query-param secret sederhana, atau pindah ke balik
// login) -- untuk sekarang cukup krn isinya cuma data sensor, bukan
// data pribadi/sensitif.
export const RawDataPage = () => {
  const [deviceIdFilter, setDeviceIdFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { data, isLoading, lastFetched, refetch } = useRawTelemetry(deviceIdFilter, autoRefresh);

  return (
    <div className="min-h-screen bg-neutral-950 p-4 font-mono text-neutral-200 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-white">Raw Telemetry Viewer</h1>
            <p className="text-xs text-neutral-500">
              Halaman internal — verifikasi data mentah dari Bridge (Rover/Trap). Tidak untuk publik.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastFetched && (
              <span className="text-xs text-neutral-500">
                Update terakhir: {lastFetched.toLocaleTimeString('id-ID')}
              </span>
            )}
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                autoRefresh ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={refetch}
              className="rounded bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition hover:bg-neutral-700"
            >
              Refresh
            </button>
          </div>
        </div>

        <input
          value={deviceIdFilter}
          onChange={(e) => setDeviceIdFilter(e.target.value)}
          placeholder="Filter deviceId (mis. ROVER-01, TRAP-01) — kosongkan utk semua"
          className="mb-4 w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-emerald-600"
        />

        {isLoading && data.length === 0 ? (
          <p className="text-sm text-neutral-500">Memuat...</p>
        ) : data.length === 0 ? (
          <div className="rounded border border-dashed border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-500">
              Belum ada data masuk{deviceIdFilter ? ` untuk deviceId "${deviceIdFilter}"` : ''}.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((row) => (
              <div key={row.id} className="rounded border border-neutral-800 bg-neutral-900 p-3">
                <div className="mb-1.5 flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded bg-emerald-900/40 px-2 py-0.5 font-bold text-emerald-400">
                    {row.deviceId}
                  </span>
                  <span className="text-neutral-500">{row.payload?.type ?? '-'}</span>
                  <span className="ml-auto text-neutral-500">
                    {new Date(row.recordedAt).toLocaleString('id-ID')}
                  </span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs text-neutral-300">
                  {JSON.stringify(row.payload, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
