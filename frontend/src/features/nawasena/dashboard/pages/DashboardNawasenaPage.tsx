import {
  IconArrowRight,
  IconBuildingStore,
  IconClipboardList,
  IconNews,
  IconPlant2,
  IconRadar,
  IconSun,
  IconTrendingUp,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

// ── Tipe data ─────────────────────────────────────────────────────

type QuickAction = {
  label: string;
  sub: string;
  icon: typeof IconNews;
  href: string;
  variant: 'green' | 'warning';
  badge?: number;
};

type Activity = {
  label: string;
  sub: string;
  time: string;
  type: 'default' | 'warning';
};

type HarvestRow = {
  name: string;
  value: string;
  pct: number;
};

// ── Data statis (ganti dengan data dari API/hook) ─────────────────

const HERO_STATS = [
  { label: 'Berita tayang', value: '12', color: 'text-white' },
  { label: 'UMKM aktif', value: '34', color: 'text-white' },
  { label: 'Hasil panen', value: '4,2 t', color: 'text-[#a5d876]' },
  { label: 'Pengajuan', value: '18', color: 'text-[#FAC775]' },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Buat berita',
    sub: '12 tayang',
    icon: IconNews,
    href: '/dashboard/berita/baru',
    variant: 'green',
  },
  {
    label: 'Input panen',
    sub: 'Musim Juni',
    icon: IconPlant2,
    href: '/dashboard/harvest/baru',
    variant: 'green',
  },
  {
    label: 'Tambah UMKM',
    sub: '34 terdaftar',
    icon: IconBuildingStore,
    href: '/dashboard/umkm/baru',
    variant: 'green',
  },
  {
    label: 'Pengajuan',
    sub: 'Perlu tindakan',
    icon: IconClipboardList,
    href: '/dashboard/pengajuan',
    variant: 'warning',
    badge: 18,
  },
];

const ACTIVITIES: Activity[] = [
  {
    label: 'Berita baru ditambahkan',
    sub: 'Program Panen Raya 2026',
    time: '2j lalu',
    type: 'default',
  },
  {
    label: 'UMKM baru terdaftar',
    sub: 'Keripik Singkong Bu Tari',
    time: '5j lalu',
    type: 'default',
  },
  {
    label: 'Pengajuan masuk',
    sub: 'Bantuan pupuk — Kelompok Tani Maju',
    time: '1h lalu',
    type: 'warning',
  },
  {
    label: 'Data panen diperbarui',
    sub: 'Blok A – Padi IR64, 1,2 ton',
    time: 'Kemarin',
    type: 'default',
  },
];

const HARVEST_ROWS: HarvestRow[] = [
  { name: 'Padi IR64', value: '2,4 t', pct: 57 },
  { name: 'Jagung Manis', value: '1,1 t', pct: 26 },
  { name: 'Sayuran', value: '0,7 t', pct: 17 },
];

// ── Komponen utama ────────────────────────────────────────────────

export const DashboardNawasenaPage = () => {
  return (
    <div className="space-y-4">

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-[14px] bg-[#0D3D1F] p-7 pb-0">
        {/* Dekorasi lingkaran */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[rgba(114,184,65,0.10)]" />
        <div className="pointer-events-none absolute bottom-[-30px] right-16 h-28 w-28 rounded-full bg-[rgba(114,184,65,0.06)]" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(114,184,65,0.35)] bg-[rgba(114,184,65,0.18)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#a5d876]">
              <IconRadar size={12} stroke={1.8} />
              Nawasena · Aktif
            </div>
            <h1 className="mt-2.5 text-[22px] font-semibold leading-snug text-white">
              Selamat datang kembali, Admin
            </h1>
            <p className="mt-1 text-[13px] text-white/50">
              Desa Karangtengah · Musim panen Juni 2026
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 pb-7">
            <span className="text-[11px] tracking-wide text-white/35">Minggu, 28 Jun 2026</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(248,205,36,0.28)] bg-[rgba(248,205,36,0.12)] px-2.5 py-1.5">
              <IconSun size={14} stroke={1.6} className="text-[#FAC775]" />
              <span className="text-[12px] font-medium text-[#FAC775]">29°C · Cerah</span>
            </div>
          </div>
        </div>

        {/* Strip statistik di bawah banner */}
        <div className="relative mt-5 grid grid-cols-4 divide-x divide-white/8 border-t border-white/8">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="px-4 py-3 first:pl-0">
              <p className="text-[10px] uppercase tracking-[0.12em] text-white/38">{s.label}</p>
              <p className={`mt-0.5 text-[20px] font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AKSI CEPAT ── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-medium text-neutral-900">Aksi cepat</h2>
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-[12px] text-[#3B6D11] hover:underline"
          >
            Lihat semua <IconArrowRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACTIONS.map((item) => {
            const isWarning = item.variant === 'warning';
            return (
              <Link
                key={item.label}
                to={item.href}
                className={[
                  'relative rounded-xl border p-3.5 transition hover:-translate-y-0.5',
                  isWarning
                    ? 'border-[#FAC775] bg-[#FAEEDA] hover:border-[#EF9F27]'
                    : 'border-neutral-200 bg-white hover:border-[#C0DD97]',
                ].join(' ')}
              >
                {item.badge ? (
                  <span className="absolute right-3 top-3 rounded-full bg-[#EF9F27] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    {item.badge}
                  </span>
                ) : null}

                <div
                  className={[
                    'grid h-9 w-9 place-items-center rounded-[9px]',
                    isWarning
                      ? 'bg-[rgba(239,159,39,0.18)]'
                      : 'bg-[#EAF3DE]',
                  ].join(' ')}
                >
                  <item.icon
                    size={18}
                    stroke={1.6}
                    className={isWarning ? 'text-[#633806]' : 'text-[#3B6D11]'}
                  />
                </div>

                <p className={`mt-2.5 text-[13px] font-medium ${isWarning ? 'text-[#412402]' : 'text-neutral-900'}`}>
                  {item.label}
                </p>
                <p className={`mt-0.5 text-[11px] ${isWarning ? 'text-[#854F0B]' : 'text-neutral-400'}`}>
                  {item.sub}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── BARIS BAWAH: Aktivitas + Panen ── */}
      <div className="grid gap-3 lg:grid-cols-2">

        {/* Aktivitas terbaru */}
        <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3.5">
            <h2 className="text-[13px] font-medium text-neutral-900">Aktivitas terbaru</h2>
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-[11px] text-[#3B6D11] hover:underline"
            >
              Semua <IconArrowRight size={10} />
            </Link>
          </div>

          <ul className="divide-y divide-neutral-100">
            {ACTIVITIES.map((a, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={[
                    'mt-0.5 h-[7px] w-[7px] flex-shrink-0 rounded-full',
                    a.type === 'warning' ? 'bg-[#EF9F27]' : 'bg-[#639922]',
                  ].join(' ')}
                />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-[12.5px] text-neutral-800">{a.label}</p>
                  <p className="truncate text-[11px] text-neutral-400">{a.sub}</p>
                </div>
                <span className="flex-shrink-0 text-[11px] text-neutral-400">{a.time}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Ringkasan panen */}
        <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3.5">
            <h2 className="text-[13px] font-medium text-neutral-900">Panen musim ini</h2>
            <span className="rounded-full bg-[#EAF3DE] px-2.5 py-0.5 text-[11px] font-medium text-[#3B6D11]">
              Juni 2026
            </span>
          </div>

          <div className="px-4 py-4 space-y-3.5">
            {HARVEST_ROWS.map((row) => (
              <div key={row.name}>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-[12px] text-neutral-500">{row.name}</span>
                  <span className="text-[12px] font-medium text-[#27500A]">{row.value}</span>
                </div>
                <div className="h-[5px] overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-[#639922]"
                    style={{ width: `${row.pct}%`, opacity: 0.4 + row.pct / 160 }}
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-neutral-100 pt-3.5">
              <span className="text-[12px] text-neutral-400">Total keseluruhan</span>
              <div className="text-right">
                <p className="text-[18px] font-semibold text-[#27500A]">4,2 ton</p>
                <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-[#3B6D11]">
                  <IconTrendingUp size={11} stroke={2} />
                  Naik 12% vs musim lalu
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};