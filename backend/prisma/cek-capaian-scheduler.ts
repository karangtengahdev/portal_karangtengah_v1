/**
 * Menghitung capaian komponen 3 indikator difusi teknologi:
 * berapa persen petani pilot yang sudah terdaftar di Digital Farming Scheduler.
 *
 * Jalankan: npx tsx prisma/cek-capaian-scheduler.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Petani pilot = petani yang punya catatan panen di sistem
  const panen = await prisma.harvestRecord.findMany({ select: { farmerName: true } });
  const petaniPilot = new Set(panen.map((p) => p.farmerName.trim().toLowerCase()));

  const jadwal = await prisma.fieldSchedule.findMany({ select: { farmerName: true, plantDate: true } });
  const terdaftar = new Set(jadwal.map((j) => j.farmerName.trim().toLowerCase()));

  const irisan = [...petaniPilot].filter((n) => terdaftar.has(n));
  const persen = petaniPilot.size > 0 ? (irisan.length / petaniPilot.size) * 100 : 0;

  console.log('Petani pilot (punya catatan panen) :', petaniPilot.size);
  console.log('Terdaftar di Scheduler            :', terdaftar.size);
  console.log('Petani pilot yang terdaftar       :', irisan.length);
  console.log('Persentase                        :', persen.toFixed(1) + '%');
  console.log('Target                            : lebih dari 40%');
  console.log('Status                            :', persen > 40 ? 'TERCAPAI' : `belum — kurang ${Math.max(0, Math.ceil(petaniPilot.size * 0.4) + 1 - irisan.length)} petani lagi`);

  const belum = [...petaniPilot].filter((n) => !terdaftar.has(n));
  if (belum.length > 0) {
    console.log('\nPetani pilot yang belum terdaftar:');
    belum.slice(0, 25).forEach((n) => console.log('  -', n));
    if (belum.length > 25) console.log(`  ... dan ${belum.length - 25} lainnya`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
