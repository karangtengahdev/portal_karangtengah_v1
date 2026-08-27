import {
  IconArrowRight,
  IconBuildingCommunity,
  IconBuildingStore,
  IconNews,
  IconRadar,
  IconSun,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

type QuickAction = {
  label: string;
  sub: string;
  icon: typeof IconNews;
  href: string;
};

type Activity = {
  label: string;
  sub: string;
  time: string;
};

// Data di halaman ini masih statis/contoh -- sama seperti dashboard
// Nawasena, ini placeholder sampai ada endpoint ringkasan sungguhan.
// Isinya SENGAJA cuma seputar konten (berita, UMKM, profil desa) --
// tidak ada data panen/jadwal tanam, itu domain area Nawasena.
const HERO_STATS = [
  { label: 'Berita tayang', value: '12', color: 'text-white' },
  { label: 'UMKM aktif', value: '34', color: 'text-white' },
  { label: 'Total produk', value: '58', color: 'text-[#a5d876]' },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Buat berita',
    sub: '12 tayang',
    icon: IconNews,
    href: '/portal-admin/berita',
  },
  {
    label: 'Tambah UMKM',
    sub: '34 terdaftar',
    icon: IconBuildingStore,
    href: '/portal-admin/umkm',
  },
  {
    label: 'Profil Desa',
    sub: 'Kelola galeri & visi misi',
    icon: IconBuildingCommunity,
    href: '/portal-admin/village',
  },
];

const ACTIVITIES: Activity[] = [
  {
    label: 'Berita baru ditambahkan',
    sub: 'Program Panen Raya 2026',
    time: '2j lalu',
  },
  {
    label: 'UMKM baru terdaftar',
    sub: 'Keripik Singkong Bu Tari',
    time: '5j lalu',
  },
  {
    label: 'Foto galeri desa ditambahkan',
    sub: 'Suasana panen padi',
    time: 'Kemarin',
  },
];

export const DashboardPortalPage = () => {
  return (
    <div className="space-y-4">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-[14px] bg-[#0D3D1F] p-7 pb-0">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[rgba(114,184,65,0.10)]" />
        <div className="pointer-events-none absolute bottom-[-30px] right-16 h-28 w-28 rounded-full bg-[rgba(114,184,65,0.06)]" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(114,184,65,0.35)] bg-[rgba(114,184,65,0.18)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#a5d876]">
              <IconRadar size={12} stroke={1.8} />
              Portal Desa · Aktif
            </div>
            <h1 className="mt-2.5 text-[22px] font-semibold leading-snug text-white">
              Selamat datang kembali, Admin Portal
            </h1>
            <p className="mt-1 text-[13px] text-white/50">
              Desa Karangtengah · Kelola konten publik desa
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

        <div className="relative mt-5 grid grid-cols-3 divide-x divide-white/8 border-t border-white/8">
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
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {QUICK_ACTIONS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="relative rounded-xl border border-neutral-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-[#C0DD97]"
            >
              <div className="grid h-9 w-9 place-items-center rounded-[9px] bg-[#EAF3DE]">
                <item.icon size={18} stroke={1.6} className="text-[#3B6D11]" />
              </div>
              <p className="mt-2.5 text-[13px] font-medium text-neutral-900">{item.label}</p>
              <p className="mt-0.5 text-[11px] text-neutral-400">{item.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AKTIVITAS TERBARU ── */}
      <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3.5">
          <h2 className="text-[13px] font-medium text-neutral-900">Aktivitas terbaru</h2>
        </div>

        <ul className="divide-y divide-neutral-100">
          {ACTIVITIES.map((a, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <span className="mt-0.5 h-[7px] w-[7px] flex-shrink-0 rounded-full bg-[#639922]" />
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-[12.5px] text-neutral-800">{a.label}</p>
                <p className="truncate text-[11px] text-neutral-400">{a.sub}</p>
              </div>
              <span className="flex-shrink-0 text-[11px] text-neutral-400">{a.time}</span>
            </li>
          ))}
        </ul>

        <Link
          to="/portal-admin/berita"
          className="flex items-center justify-center gap-1 border-t border-neutral-100 px-4 py-3 text-[12px] font-medium text-[#3B6D11] hover:bg-neutral-50"
        >
          Lihat semua berita <IconArrowRight size={11} />
        </Link>
      </section>
    </div>
  );
};
