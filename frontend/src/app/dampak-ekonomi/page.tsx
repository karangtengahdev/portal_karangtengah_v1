import s from './page.module.css';

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const rupiah = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const angka = (n: number, d = 2) =>
  n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });

type Props = { searchParams: Promise<{ dari?: string; sampai?: string }> };

export default async function DampakEkonomiPage({ searchParams }: Props) {
  const { dari = '2026-01-01', sampai = '2026-12-31' } = await searchParams;

  const res = await fetch(`${API}/ekonomi/dampak?dari=${dari}&sampai=${sampai}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <main className={s.page}>
        <div className={s.kosong}>
          <h1>Perhitungan belum bisa dijalankan</h1>
          <p>
            Belum ada catatan panen pada rentang tanggal ini, atau asumsi perhitungan belum diisi.
            Tambahkan laporan panen melalui modul Pascapanen, lalu buka halaman ini kembali.
          </p>
        </div>
      </main>
    );
  }

  const { data, perhitungan } = await res.json();
  const { asumsi, sebelum, sesudah, penghematan, proyeksiReplikasi, jejakPerhitungan } =
    perhitungan;

  const petakPilot = data.petakTerdokumentasi.filter((p: any) => p.bagianPilot);

  return (
    <main className={s.page}>
      <header className={s.kepala}>
        <p className={s.kalurahan}>Kalurahan Karangtengah, Imogiri, Bantul</p>
        <h1 className={s.judul}>Dampak ekonomi pengendalian hama di lahan sawah</h1>
        <p className={s.sumberData}>
          Dihitung dari {data.jumlahLaporan} catatan panen milik {data.jumlahPetani} petani
          antara {data.periode.dari} dan {data.periode.sampai}, mencakup {data.jumlahPetak} petak
          seluas {angka(data.totalLuasTerdataHa)} hektar. Produktivitas diukur dengan metode
          ubinan 2,5 x 2,5 meter.
        </p>
      </header>

      {/* Angka pokok yang keluar dari data riil */}
      <section className={s.pokok}>
        <div className={s.pokokUtama}>
          <span className={s.pokokAngka}>{angka(data.rataProduktivitasTonPerHa, 2)}</span>
          <span className={s.pokokSatuan}>ton per hektar</span>
          <p className={s.pokokKet}>
            Rata-rata hasil panen tertimbang luas lahan. Inilah satu-satunya angka yang diukur;
            seluruh nilai rupiah di bawah diturunkan darinya.
          </p>
        </div>
        <dl className={s.pokokLain}>
          <div>
            <dt>Total hasil panen tercatat</dt>
            <dd>{angka(data.totalHasilKg, 0)} kg</dd>
          </div>
          <div>
            <dt>Petak terdokumentasi</dt>
            <dd>{data.jumlahPetak} petak</dd>
          </div>
          <div>
            <dt>Petak di lahan pilot</dt>
            <dd>{petakPilot.length} petak</dd>
          </div>
        </dl>
      </section>

      {/* Asumsi diletakkan di atas, bukan disembunyikan di catatan kaki */}
      <section className={s.blok}>
        <h2 className={s.blokJudul}>Dari mana angkanya</h2>
        <p className={s.blokKet}>
          Perhitungan di halaman ini memakai enam ketetapan berikut. Ubah nilainya lewat basis
          data, dan seluruh angka di halaman ini ikut berubah.
        </p>
        <table className={s.tabel}>
          <thead>
            <tr>
              <th>Ketetapan</th>
              <th className={s.kanan}>Nilai</th>
              <th>Sumber</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Kerugian hama sebelum program</td>
              <td className={s.kanan}>
                {angka(asumsi.kerugianBaselineMin * 100, 0)}–
                {angka(asumsi.kerugianBaselineMaks * 100, 0)}%
              </td>
              <td>{asumsi.sumber.kerugianBaseline}</td>
            </tr>
            <tr>
              <td>Target kerugian setelah program</td>
              <td className={s.kanan}>{angka(asumsi.kerugianTarget * 100, 0)}%</td>
              <td>{asumsi.sumber.kerugianTarget}</td>
            </tr>
            <tr>
              <td>Harga gabah kering panen</td>
              <td className={s.kanan}>{rupiah(asumsi.hargaGabahPerKg)}/kg</td>
              <td>{asumsi.sumber.hargaGabahPerKg}</td>
            </tr>
            <tr>
              <td>Luas lahan pilot</td>
              <td className={s.kanan}>{angka(asumsi.luasPilotHa)} ha</td>
              <td>Lahan percontohan program</td>
            </tr>
            <tr>
              <td>Luas sawah kalurahan</td>
              <td className={s.kanan}>{angka(asumsi.luasTotalHa)} ha</td>
              <td>{asumsi.sumber.luasTotalHa}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Sebelum dan sesudah */}
      <section className={s.blok}>
        <h2 className={s.blokJudul}>Sebelum dan sesudah pengendalian hama</h2>
        <div className={s.banding}>
          <article className={s.kolomSebelum}>
            <h3>Sebelum</h3>
            <p className={s.bandingAngka}>{angka(sebelum.hasilTonPerHa, 2)} ton/ha</p>
            <p className={s.bandingKet}>hasil yang benar-benar sampai ke petani</p>
            <ul className={s.rincian}>
              <li>
                <span>Potensi tanpa serangan hama</span>
                <b>{angka(sebelum.skenarioMaks.hasilPotensialTonPerHa, 2)} ton/ha</b>
              </li>
              <li>
                <span>Hilang akibat hama</span>
                <b>{angka(sebelum.skenarioMaks.kerugianTonPerHa, 2)} ton/ha</b>
              </li>
              <li className={s.rincianTegas}>
                <span>Nilai kerugian di lahan pilot</span>
                <b>
                  {rupiah(sebelum.skenarioMin.kerugianRupiahPilot)} –{' '}
                  {rupiah(sebelum.skenarioMaks.kerugianRupiahPilot)}
                </b>
              </li>
            </ul>
          </article>

          <article className={s.kolomSesudah}>
            <h3>Bila kerugian ditekan ke {angka(sesudah.tingkatKerugian * 100, 0)}%</h3>
            <p className={s.bandingAngka}>{angka(sesudah.hasilTonPerHaMaks, 2)} ton/ha</p>
            <p className={s.bandingKet}>hasil yang bisa dicapai di lahan pilot</p>
            <ul className={s.rincian}>
              <li>
                <span>Kenaikan hasil</span>
                <b>{angka(penghematan.kenaikanTonPerHaMaks, 2)} ton/ha</b>
              </li>
              <li>
                <span>Setara tambahan gabah</span>
                <b>
                  {angka(
                    penghematan.kenaikanTonPerHaMaks * 1000 * asumsi.luasPilotHa,
                    0,
                  )}{' '}
                  kg
                </b>
              </li>
              <li className={s.rincianTegas}>
                <span>Nilai penghematan per musim</span>
                <b>
                  {rupiah(penghematan.rupiahPilotMin)} – {rupiah(penghematan.rupiahPilotMaks)}
                </b>
              </li>
            </ul>
          </article>
        </div>
        <p className={s.catatan}>
          Rentang muncul karena kerugian sebelum program berada di kisaran{' '}
          {angka(asumsi.kerugianBaselineMin * 100, 0)}–
          {angka(asumsi.kerugianBaselineMaks * 100, 0)}%, bukan satu angka tunggal. Nilai
          terendah memakai baseline {angka(asumsi.kerugianBaselineMin * 100, 0)}%, tertinggi
          memakai {angka(asumsi.kerugianBaselineMaks * 100, 0)}%.
        </p>
      </section>

      {/* Proyeksi replikasi */}
      <section className={s.blok}>
        <h2 className={s.blokJudul}>Bila diterapkan di seluruh sawah kalurahan</h2>
        <div className={s.proyeksi}>
          <div>
            <p className={s.proyeksiAngka}>
              {rupiah(proyeksiReplikasi.rupiahMin)} – {rupiah(proyeksiReplikasi.rupiahMaks)}
            </p>
            <p className={s.proyeksiKet}>
              tambahan nilai panen per musim bila pengendalian hama diterapkan di seluruh{' '}
              {angka(proyeksiReplikasi.luasHa)} hektar sawah Kalurahan Karangtengah
            </p>
          </div>
          <p className={s.proyeksiRumus}>
            Diperoleh dengan mengalikan penghematan di lahan pilot sebesar{' '}
            {angka(proyeksiReplikasi.faktorPengali)}×, yaitu perbandingan luas sawah kalurahan
            terhadap luas lahan pilot. Ini adalah proyeksi, bukan hasil yang sudah terjadi.
          </p>
        </div>
      </section>

      {/* Jejak perhitungan */}
      <section className={s.blok}>
        <h2 className={s.blokJudul}>Langkah perhitungan</h2>
        <ol className={s.jejak}>
          {jejakPerhitungan.map((baris: string, i: number) => (
            <li key={i}>{baris}</li>
          ))}
        </ol>
      </section>

      {/* Daftar petak — bukti dokumentasi */}
      <section className={s.blok}>
        <h2 className={s.blokJudul}>Petak yang masuk perhitungan</h2>
        <p className={s.blokKet}>
          Seluruh {data.jumlahPetak} petak di bawah ini dipakai menghitung rata-rata
          produktivitas. Petak bertanda pilot berada di lahan percontohan program.
        </p>
        <table className={s.tabel}>
          <thead>
            <tr>
              <th>Kode petak</th>
              <th>Petani</th>
              <th>Padukuhan</th>
              <th className={s.kanan}>Luas (ha)</th>
              <th className={s.kanan}>Hasil (kg)</th>
              <th className={s.kanan}>Ton/ha</th>
              <th>Panen</th>
            </tr>
          </thead>
          <tbody>
            {data.petakTerdokumentasi.map((p: any) => (
              <tr key={p.kodePetak}>
                <td>
                  {p.kodePetak}
                  {p.bagianPilot && <span className={s.tandaPilot}>pilot</span>}
                </td>
                <td>{p.namaPetani}</td>
                <td>{p.padukuhan}</td>
                <td className={s.kanan}>{angka(p.luasHa, 3)}</td>
                <td className={s.kanan}>{angka(p.hasilKg, 0)}</td>
                <td className={s.kanan}>{angka(p.produktivitasTonPerHa, 2)}</td>
                <td>{p.tanggalPanen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className={s.kaki}>
        Halaman ini dihasilkan langsung dari basis data NAWASENA Center. Setiap kali laporan
        panen baru masuk, angkanya dihitung ulang.
      </footer>
    </main>
  );
}
