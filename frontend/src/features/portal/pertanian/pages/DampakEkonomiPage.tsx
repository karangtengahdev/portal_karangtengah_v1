import { useEffect, useState } from 'react';
import {
  IconAlertTriangle,
  IconArrowNarrowRight,
  IconBug,
  IconChartArrowsVertical,
  IconSeeding,
} from '@tabler/icons-react';

import { ambilDampakEkonomi, type DampakEkonomi } from '../api/ekonomi';

const rupiah = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const angka = (n: number, d = 2) =>
  n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
const persen = (fraksi: number) => `${angka(fraksi * 100, 0)}%`;

const LABEL = 'text-xs font-bold uppercase tracking-[0.16em] text-[#72b841]';
const KARTU = 'rounded-2xl border border-[#e5ecdf] bg-white p-6 shadow-sm';

export const DampakEkonomiPage = () => {
  const [hasil, setHasil] = useState<DampakEkonomi | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);

  useEffect(() => {
    let aktif = true;
    ambilDampakEkonomi()
      .then((d) => aktif && setHasil(d))
      .catch(
        (e) =>
          aktif &&
          setGalat(
            e?.response?.data?.error?.message ?? e?.message ?? 'Perhitungan tidak dapat dimuat.',
          ),
      )
      .finally(() => aktif && setMemuat(false));
    return () => {
      aktif = false;
    };
  }, []);

  if (memuat) {
    return (
      <div className="bg-[#fbfcf8] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px] space-y-6">
          <div className="h-40 animate-pulse rounded-[20px] bg-[#eef3e8]" />
          <div className="h-[320px] animate-pulse rounded-[20px] bg-[#eef3e8]" />
        </div>
      </div>
    );
  }

  if (galat || !hasil) {
    return (
      <div className="bg-[#fbfcf8] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[20px] border border-dashed border-orange-200 bg-orange-50 p-10 text-center">
          <IconAlertTriangle size={32} className="mx-auto mb-3 text-orange-500" />
          <p className="font-bold text-orange-700">Perhitungan belum bisa ditampilkan</p>
          <p className="mt-2 text-sm text-orange-700/80">{galat}</p>
        </div>
      </div>
    );
  }

  const { data, perhitungan } = hasil;
  const { asumsi, sebelum, sesudah, penghematan, proyeksiReplikasi, jejakPerhitungan } =
    perhitungan;

  return (
    <div className="bg-[#fbfcf8] text-[#212529]">
      {/* Hero */}
      <section className="relative -mt-24 overflow-hidden bg-[#0f1d0b] px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-[1440px]">
          <p className={`${LABEL} inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 !text-[#b8ee70] backdrop-blur-md`}>
            <IconChartArrowsVertical size={16} stroke={1.8} />
            Kalkulasi Dampak
          </p>
          <h1 className="mt-6 max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[52px] lg:leading-[1.1]">
            Dampak ekonomi pengendalian hama di lahan sawah
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#d4dec8] sm:text-base">
            Dihitung dari {data.jumlahLaporan} catatan panen milik {data.jumlahPetani} petani
            antara {data.periode.dari} dan {data.periode.sampai}, mencakup {data.jumlahPetak}{' '}
            petak seluas {angka(data.totalLuasTerdataHa)} hektar. Produktivitas diukur dengan
            metode ubinan 2,5 × 2,5 meter.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px] space-y-16">
          {/* Dua rata-rata */}
          <div>
            <p className={LABEL}>Angka Pokok</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#101708] sm:text-3xl">
              Dua cara membaca produktivitas
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6C757D]">
              Keduanya benar, tetapi menjawab pertanyaan berbeda. Seluruh nilai rupiah di
              halaman ini memakai angka tertimbang luas, karena yang dihitung adalah nilai
              seluruh sawah, bukan hasil satu petak.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border-2 border-[#0F6B35] bg-white p-6 shadow-lg">
                <p className="text-sm font-bold uppercase tracking-widest text-[#0F6B35]">
                  Tertimbang luas
                </p>
                <p className="mt-2 text-5xl font-extrabold leading-none text-[#101708]">
                  {angka(data.rataProduktivitasTonPerHa)}
                  <span className="ml-2 text-base font-bold text-[#6C757D]">Ton/Ha</span>
                </p>
                <p className="mt-3 text-sm leading-6 text-[#6C757D]">
                  Total {angka(data.totalHasilKg, 0)} kg dibagi{' '}
                  {angka(data.totalLuasTerdataHa)} ha. Inilah dasar seluruh perhitungan nilai.
                </p>
              </div>

              <div className={KARTU}>
                <p className="text-sm font-bold uppercase tracking-widest text-[#6C757D]">
                  Rata-rata per petak
                </p>
                <p className="mt-2 text-5xl font-extrabold leading-none text-[#101708]">
                  {angka(data.rataPerPetakTonPerHa)}
                  <span className="ml-2 text-base font-bold text-[#6C757D]">Ton/Ha</span>
                </p>
                <p className="mt-3 text-sm leading-6 text-[#6C757D]">
                  Rata-rata sederhana dari {data.jumlahPetak} petak. Menggambarkan hasil sebuah
                  petak pada umumnya.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5ecdf] bg-[#f7fbf3] p-6">
                <p className="text-sm font-bold uppercase tracking-widest text-[#4f842f]">
                  Mengapa berbeda
                </p>
                <p className="mt-3 text-sm leading-6 text-[#4f842f]">
                  Selisih kedua angka menunjukkan ketimpangan antarpetak: beberapa petak luas
                  justru berhasil sangat rendah, sehingga menarik turun angka tertimbang.
                </p>
                <p className="mt-3 text-sm leading-6 text-[#4f842f]">
                  Kerugian hama yang dilaporkan petani:{' '}
                  <b>
                    {data.kerugianHamaTercatat.tersedia
                      ? `${persen(data.kerugianHamaTercatat.rataFraksi ?? 0)} dari ${data.kerugianHamaTercatat.jumlahLaporan} laporan`
                      : 'belum diisi'}
                  </b>
                </p>
              </div>
            </div>
          </div>

          {/* Kasus terparah */}
          {data.kasusTerparah && (
            <div className="overflow-hidden rounded-[20px] border border-orange-200 bg-orange-50">
              <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
                <div className="flex items-center gap-4">
                  <IconBug size={40} className="shrink-0 text-orange-500" stroke={1.6} />
                  <div>
                    <p className="text-5xl font-extrabold leading-none text-orange-600">
                      {angka(data.kasusTerparah.produktivitasTonPerHa)}
                      <span className="ml-2 text-base font-bold text-orange-500">Ton/Ha</span>
                    </p>
                    <p className="mt-1 text-sm font-bold text-orange-600">
                      {angka(data.kasusTerparah.selisihDariRataPersen, 0)}% di bawah rata-rata
                      desa
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                    Petak Terdampak Terparah
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[#101708]">
                    Lahan {data.kasusTerparah.namaPetani}, Padukuhan{' '}
                    {data.kasusTerparah.padukuhan}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6C757D]">
                    Lahan seluas {angka(data.kasusTerparah.luasHa, 2)} hektar hanya menghasilkan{' '}
                    {angka(data.kasusTerparah.hasilKg, 0)} kg, jauh di bawah rata-rata desa
                    sebesar {angka(data.rataProduktivitasTonPerHa)} ton per hektar. Petak inilah
                    yang paling terdampak serangan hama tikus, dan menjadi alasan utama program
                    pengendalian dijalankan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Asumsi */}
          <div>
            <p className={LABEL}>Transparansi Perhitungan</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#101708] sm:text-3xl">
              Dari mana angkanya
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6C757D]">
              Perhitungan di halaman ini memakai lima ketetapan berikut. Ubah nilainya lewat
              basis data, dan seluruh angka ikut berubah.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e5ecdf] bg-white">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-[#f7fbf3] text-left text-xs font-bold uppercase tracking-widest text-[#4f842f]">
                  <tr>
                    <th className="px-5 py-3">Ketetapan</th>
                    <th className="px-5 py-3 text-right">Nilai</th>
                    <th className="px-5 py-3">Sumber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef3e8]">
                  {[
                    [
                      'Kerugian hama sebelum program',
                      `${persen(asumsi.kerugianBaselineMin)}–${persen(asumsi.kerugianBaselineMaks)}`,
                      asumsi.sumber.kerugianBaseline,
                    ],
                    [
                      'Target kerugian setelah program',
                      persen(asumsi.kerugianTarget),
                      asumsi.sumber.kerugianTarget,
                    ],
                    [
                      'Harga gabah kering panen',
                      `${rupiah(asumsi.hargaGabahPerKg)}/kg`,
                      asumsi.sumber.hargaGabahPerKg,
                    ],
                    [
                      'Luas lahan pilot',
                      `${angka(asumsi.luasPilotHa)} ha`,
                      'Lahan percontohan program',
                    ],
                    [
                      'Luas sawah kalurahan',
                      `${angka(asumsi.luasTotalHa)} ha`,
                      asumsi.sumber.luasTotalHa,
                    ],
                  ].map(([k, v, s]) => (
                    <tr key={k}>
                      <td className="px-5 py-3 font-semibold text-[#101708]">{k}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-bold text-[#0F6B35]">
                        {v}
                      </td>
                      <td className="px-5 py-3 text-[#6C757D]">{s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sebelum & sesudah */}
          <div>
            <p className={LABEL}>Perbandingan</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#101708] sm:text-3xl">
              Sebelum dan sesudah pengendalian hama
            </h2>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#f2e2b8] bg-[#fdf8ec] p-8">
                <p className="text-sm font-bold uppercase tracking-widest text-[#9a6b12]">
                  Sebelum
                </p>
                <p className="mt-2 text-4xl font-extrabold text-[#101708]">
                  {angka(sebelum.hasilTonPerHa)}{' '}
                  <span className="text-base font-bold text-[#6C757D]">Ton/Ha</span>
                </p>
                <p className="mt-1 text-sm text-[#6C757D]">
                  hasil yang benar-benar sampai ke petani
                </p>
                <dl className="mt-6 space-y-3 border-t border-[#f2e2b8] pt-4">
                  <Baris
                    k="Potensi tanpa serangan hama"
                    v={`${angka(sebelum.skenarioMaks.hasilPotensialTonPerHa)} ton/ha`}
                  />
                  <Baris
                    k="Hilang akibat hama"
                    v={`${angka(sebelum.skenarioMaks.kerugianTonPerHa)} ton/ha`}
                  />
                  <Baris
                    k="Nilai kerugian di lahan pilot"
                    v={`${rupiah(sebelum.skenarioMin.kerugianRupiahPilot)} – ${rupiah(sebelum.skenarioMaks.kerugianRupiahPilot)}`}
                    tegas
                  />
                </dl>
              </div>

              <div className="rounded-2xl border border-[#bdd9a8] bg-[#f7fbf3] p-8">
                <p className="text-sm font-bold uppercase tracking-widest text-[#4f842f]">
                  Bila kerugian ditekan ke {persen(sesudah.tingkatKerugian)}
                </p>
                <p className="mt-2 text-4xl font-extrabold text-[#101708]">
                  {angka(sesudah.hasilTonPerHaMaks)}{' '}
                  <span className="text-base font-bold text-[#6C757D]">Ton/Ha</span>
                </p>
                <p className="mt-1 text-sm text-[#6C757D]">
                  hasil yang bisa dicapai di lahan pilot
                </p>
                <dl className="mt-6 space-y-3 border-t border-[#bdd9a8] pt-4">
                  <Baris
                    k="Kenaikan hasil"
                    v={`${angka(penghematan.kenaikanTonPerHaMaks)} ton/ha`}
                  />
                  <Baris
                    k="Setara tambahan gabah"
                    v={`${angka(penghematan.kenaikanTonPerHaMaks * 1000 * asumsi.luasPilotHa, 0)} kg`}
                  />
                  <Baris
                    k="Nilai penghematan per musim"
                    v={`${rupiah(penghematan.rupiahPilotMin)} – ${rupiah(penghematan.rupiahPilotMaks)}`}
                    tegas
                  />
                </dl>
              </div>
            </div>

            <p className="mt-4 max-w-4xl text-xs leading-6 text-[#6C757D]">
              Rentang muncul karena kerugian sebelum program berada di kisaran{' '}
              {persen(asumsi.kerugianBaselineMin)}–{persen(asumsi.kerugianBaselineMaks)}, bukan
              satu angka tunggal. Produktivitas dihitung dari seluruh{' '}
              {angka(data.totalLuasTerdataHa)} hektar yang terdata, sedangkan nilai rupiah
              dihitung untuk lahan pilot seluas {angka(asumsi.luasPilotHa)} hektar.
            </p>
          </div>

          {/* Proyeksi */}
          <div className="overflow-hidden rounded-[20px] bg-[#0f1d0b]">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8ee70]">
                  Proyeksi Replikasi
                </p>
                <p className="mt-4 text-3xl font-extrabold leading-tight text-[#F8CD24] sm:text-4xl">
                  {rupiah(proyeksiReplikasi.rupiahMin)} –{' '}
                  {rupiah(proyeksiReplikasi.rupiahMaks)}
                </p>
                <p className="mt-3 max-w-md text-sm leading-7 text-[#d4dec8]">
                  tambahan nilai panen per musim bila pengendalian hama diterapkan di seluruh{' '}
                  {angka(proyeksiReplikasi.luasHa)} hektar sawah Kalurahan Karangtengah
                </p>
              </div>
              <p className="text-sm leading-7 text-[#d4dec8]">
                Diperoleh dengan mengalikan penghematan di lahan pilot sebesar{' '}
                {angka(proyeksiReplikasi.faktorPengali)}×, yaitu perbandingan luas sawah
                kalurahan terhadap luas lahan pilot.{' '}
                <b className="text-white">
                  Ini adalah proyeksi, bukan hasil yang sudah terjadi.
                </b>
              </p>
            </div>
          </div>

          {/* Jejak */}
          <div>
            <p className={LABEL}>Rantai Perhitungan</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#101708] sm:text-3xl">
              Langkah perhitungan
            </h2>
            <ol className="mt-6 max-w-4xl space-y-3">
              {jejakPerhitungan.map((baris, i) => (
                <li key={i} className="flex gap-4 border-b border-[#eef3e8] pb-3 last:border-0">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef3e8] text-xs font-bold text-[#4f842f]">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-7 text-[#495057]">{baris}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tabel petak */}
          <div>
            <p className={LABEL}>Data Sumber</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#101708] sm:text-3xl">
              Petak yang masuk perhitungan
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6C757D]">
              Seluruh {data.jumlahPetak} petak di bawah ini dipakai menghitung produktivitas.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e5ecdf] bg-white">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-[#f7fbf3] text-left text-xs font-bold uppercase tracking-widest text-[#4f842f]">
                  <tr>
                    <th className="px-5 py-3">Kode petak</th>
                    <th className="px-5 py-3">Petani</th>
                    <th className="px-5 py-3">Padukuhan</th>
                    <th className="px-5 py-3 text-right">Luas (ha)</th>
                    <th className="px-5 py-3 text-right">Hasil (kg)</th>
                    <th className="px-5 py-3 text-right">Ton/ha</th>
                    <th className="px-5 py-3">Panen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef3e8]">
                  {data.petakTerdokumentasi.map((p, i) => {
                    const terparah = data.kasusTerparah?.kodePetak === p.kodePetak;
                    return (
                      <tr
                        key={`${p.kodePetak}-${i}`}
                        className={terparah ? 'bg-orange-50' : 'hover:bg-[#fbfcf8]'}
                      >
                        <td className="whitespace-nowrap px-5 py-3 font-medium text-[#101708]">
                          {p.kodePetak}
                          {terparah && (
                            <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600">
                              terparah
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">{p.namaPetani}</td>
                        <td className="px-5 py-3 text-[#6C757D]">{p.padukuhan}</td>
                        <td className="px-5 py-3 text-right">{angka(p.luasHa, 3)}</td>
                        <td className="px-5 py-3 text-right">{angka(p.hasilKg, 0)}</td>
                        <td className="px-5 py-3 text-right font-bold text-[#0F6B35]">
                          {angka(p.produktivitasTonPerHa)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-[#6C757D]">
                          {p.tanggalPanen}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-[#6C757D]">
              <IconSeeding size={14} className="text-[#72b841]" />
              Halaman ini dihasilkan langsung dari basis data NAWASENA Center. Setiap kali
              catatan panen baru masuk, angkanya dihitung ulang.
              <IconArrowNarrowRight size={14} />
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const Baris = ({ k, v, tegas }: { k: string; v: string; tegas?: boolean }) => (
  <div className="flex items-start justify-between gap-4">
    <dt className="text-sm text-[#6C757D]">{k}</dt>
    <dd
      className={`text-right ${tegas ? 'text-base font-extrabold text-[#101708]' : 'text-sm font-bold text-[#495057]'}`}
    >
      {v}
    </dd>
  </div>
);
