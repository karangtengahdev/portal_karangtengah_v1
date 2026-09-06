import { IconArrowRight, IconCoin } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

type DampakEkonomiCtaProps = {
  /** Rata-rata produktivitas desa, dipakai sebagai pengait ke halaman perhitungan. */
  avgYieldTonHa?: number | null;
};

export const DampakEkonomiCta = ({ avgYieldTonHa }: DampakEkonomiCtaProps) => (
  <div className="overflow-hidden rounded-[20px] border border-[#e5ecdf] bg-[#0f1d0b]">
    <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.15fr_auto] lg:items-center">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#b8ee70]">
          <IconCoin size={16} stroke={1.8} />
          Kalkulasi Dampak
        </p>

        <h2 className="mt-5 max-w-2xl text-2xl font-extrabold leading-snug text-white sm:text-3xl">
          Berapa nilai panen yang hilang karena hama, dan berapa yang bisa
          diselamatkan?
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d4dec8]">
          {avgYieldTonHa
            ? `Dari rata-rata produktivitas ${avgYieldTonHa.toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} ton per hektar, kami hitung nilai kerugian akibat hama dan potensi penghematannya.`
            : 'Dari laporan panen warga, kami hitung nilai kerugian akibat hama dan potensi penghematannya.'}{' '}
          Seluruh asumsi dan langkah perhitungannya ditampilkan terbuka agar bisa
          diperiksa siapa pun.
        </p>
      </div>

      <Link
        to="/pertanian/dampak-ekonomi"
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#72b841] px-7 py-4 text-sm font-bold text-[#0f1d0b] transition hover:bg-[#b8ee70] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8ee70] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1d0b]"
      >
        Lihat perhitungannya
        <IconArrowRight
          size={18}
          stroke={2}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  </div>
);
