import {
  IconMapPin,
  IconMail,
  IconClock,
  IconBrandWhatsapp,
  IconSend,
  IconLeaf,
  IconPlant2,
  IconUsers,
} from '@tabler/icons-react';

const contacts = [
  {
    label: 'Kantor Pelayanan Terpadu',
    value: 'Kalurahan Karangtengah, Imogiri, Bantul, DIY 55782',
    note: 'Administrasi, surat, dan konsultasi tatap muka',
    icon: IconMapPin,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    label: 'Konsultasi Cepat',
    value: '+62 812-0000-0000',
    note: 'Tanya jadwal tanam, hama, atau sensor lahan',
    icon: IconBrandWhatsapp,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: 'Dokumen & Surat Resmi',
    value: 'pemdes@karangtengah.desa.id',
    note: 'Pengajuan tertulis dan berkas administrasi',
    icon: IconMail,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    label: 'Jam Kunjungan Lapangan',
    value: 'Senin - Jumat, 08:00 - 15:00 WIB',
    note: 'Petugas penyuluh siap di kantor & lahan binaan',
    icon: IconClock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

const fieldStats = [
  { label: 'Petani terdaftar', value: '120+' },
  { label: 'Kelompok tani aktif', value: '18' },
  { label: 'Rata-rata respons', value: '< 2 jam' },
];

export const KontakPage = () => {
  return (
    <div className="min-h-screen bg-[#fbfcf8] pb-24 text-[#212529]">
      {/* Header Section — clean & terang */}
      <section className="relative overflow-hidden bg-white px-4 pb-14 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px] text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#72b841]/12 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#2F6D18]">
            <IconLeaf size={16} stroke={1.8} />
            Layanan Smart Farming Desa
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-[#101708] sm:text-5xl lg:text-[52px]">
            Terhubung langsung dengan tim lapangan Karangtengah
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6C757D] sm:text-base">
            Sampaikan pertanyaan seputar jadwal tanam, data sensor lahan,
            UMKM, administrasi surat, atau pengaduan — direspons langsung
            oleh admin dan penyuluh desa.
          </p>

          {/* Stat strip - clean, garis tipis */}
          <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 divide-x divide-[#e5ecdf] rounded-[18px] border border-[#e5ecdf] bg-[#f9fbf7]">
            {fieldStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 px-3 py-5">
                <span className="text-xl font-extrabold text-[#2F6D18] sm:text-2xl">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wide text-[#6C757D]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">

          {/* Bagian Kiri: Info Kontak & Peta */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {contacts.map((contact) => (
                <article
                  className="group rounded-[20px] border border-[#e5ecdf] bg-white p-6 shadow-[0_8px_24px_rgba(16,23,8,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(16,23,8,0.08)]"
                  key={contact.label}
                >
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-full ${contact.bg} ${contact.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <contact.icon size={24} stroke={1.5} />
                  </div>
                  <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-[#6C757D]">
                    {contact.label}
                  </h3>
                  <p className="mt-2 text-base font-bold text-[#101708]">
                    {contact.value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#8a948a]">
                    {contact.note}
                  </p>
                </article>
              ))}
            </div>

            {/* Penyuluh siaga */}
            <div className="flex items-center gap-4 rounded-[20px] border border-[#e5ecdf] bg-white p-5 shadow-[0_8px_24px_rgba(16,23,8,0.04)]">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#72b841]/12 text-[#2F6D18]">
                <IconUsers size={22} stroke={1.6} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#101708]">
                  3 penyuluh lapangan siaga minggu ini
                </p>
                <p className="text-xs leading-5 text-[#6C757D]">
                  Kunjungan ke kelompok tani Sidomulyo, Ngudirejo, dan
                  Karangsari sesuai jadwal kunjungan lapangan.
                </p>
              </div>
            </div>

            {/* Area Peta */}
            <div className="overflow-hidden rounded-[20px] border border-[#e5ecdf] bg-white p-2 shadow-[0_8px_24px_rgba(16,23,8,0.04)]">
              <iframe
                title="Peta Desa Karangtengah"
                src="https://www.google.com/maps?q=Karangtengah,+Imogiri,+Bantul+Regency,+Special+Region+of+Yogyakarta&output=embed"
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Bagian Kanan: Form Hubungi Kami */}
          <div className="rounded-[24px] border border-[#e5ecdf] bg-white p-8 shadow-[0_12px_32px_rgba(16,23,8,0.06)] sm:p-10">
            <div className="flex items-center gap-2">
              <IconPlant2 size={20} className="text-[#72b841]" stroke={1.8} />
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#72b841]">
                Ajukan pertanyaan
              </p>
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-[#101708] sm:text-3xl">
              Kirim pesan langsung
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6C757D]">
              Admin desa dan penyuluh akan merespons melalui WhatsApp atau
              email yang Anda cantumkan di bawah ini.
            </p>

            <form className="mt-8 grid gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-[#3d453b]">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Masukkan nama Anda"
                    className="w-full rounded-xl border border-[#e5ecdf] bg-[#f9fbf7] px-4 py-3 text-sm text-[#101708] outline-none transition focus:border-[#72b841] focus:ring-2 focus:ring-[#72b841]/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-bold text-[#3d453b]">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Contoh: 08123456789"
                    className="w-full rounded-xl border border-[#e5ecdf] bg-[#f9fbf7] px-4 py-3 text-sm text-[#101708] outline-none transition focus:border-[#72b841] focus:ring-2 focus:ring-[#72b841]/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-bold text-[#3d453b]">
                  Kategori Keperluan
                </label>
                <select
                  id="subject"
                  className="w-full rounded-xl border border-[#e5ecdf] bg-[#f9fbf7] px-4 py-3 text-sm text-[#101708] outline-none transition focus:border-[#72b841] focus:ring-2 focus:ring-[#72b841]/20"
                >
                  <option value="pertanian">Konsultasi Pertanian & Smart Farming</option>
                  <option value="umum">Layanan Administrasi / Umum</option>
                  <option value="umkm">Pendaftaran Direktori UMKM</option>
                  <option value="pengaduan">Kritik & Pengaduan</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-[#3d453b]">
                  Isi Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Contoh: lahan padi saya di RT 04 menunjukkan gejala daun menguning, mohon dijadwalkan kunjungan penyuluh..."
                  className="w-full resize-y rounded-xl border border-[#e5ecdf] bg-[#f9fbf7] px-4 py-3 text-sm text-[#101708] outline-none transition focus:border-[#72b841] focus:ring-2 focus:ring-[#72b841]/20"
                  required
                />
              </div>

              <button
                type="submit"
                className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#72b841] px-6 text-sm font-bold text-white transition hover:bg-[#62a23a]"
              >
                Kirim Pesan Sekarang
                <IconSend size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};