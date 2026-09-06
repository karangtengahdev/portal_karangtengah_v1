import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Box,
  Card,
  Container,
  Divider,
  Group,
  List,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

import { ambilDampakEkonomi, type DampakEkonomi } from '../api/ekonomi';

const rupiah = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const angka = (n: number, d = 2) =>
  n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
const persen = (fraksi: number) => `${angka(fraksi * 100, 0)}%`;

export const DampakEkonomiPage = () => {
  const [hasil, setHasil] = useState<DampakEkonomi | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);

  useEffect(() => {
    let aktif = true;

    ambilDampakEkonomi()
      .then((d) => aktif && setHasil(d))
      .catch((e) =>
        aktif &&
        setGalat(
          e?.response?.data?.error?.message ??
            e?.message ??
            'Perhitungan tidak dapat dimuat.',
        ),
      )
      .finally(() => aktif && setMemuat(false));

    return () => {
      aktif = false;
    };
  }, []);

  if (memuat) {
    return (
      <Container size="lg" py="xl">
        <Group justify="center" py={80}>
          <Loader />
        </Group>
      </Container>
    );
  }

  if (galat || !hasil) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertTriangle size={18} />}
          color="yellow"
          title="Perhitungan belum bisa ditampilkan"
        >
          {galat ??
            'Belum ada catatan panen pada rentang tanggal ini, atau asumsi perhitungan belum diisi.'}
        </Alert>
      </Container>
    );
  }

  const { data, perhitungan } = hasil;
  const { asumsi, sebelum, sesudah, penghematan, proyeksiReplikasi, jejakPerhitungan } =
    perhitungan;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Kepala */}
        <Box>
          <Text size="sm" c="dimmed">
            Kalurahan Karangtengah, Imogiri, Bantul
          </Text>
          <Title order={1} mt={4} style={{ maxWidth: '22ch', lineHeight: 1.15 }}>
            Dampak ekonomi pengendalian hama di lahan sawah
          </Title>
          <Text mt="sm" c="dimmed" style={{ maxWidth: '68ch' }}>
            Dihitung dari {data.jumlahLaporan} catatan panen milik {data.jumlahPetani} petani
            antara {data.periode.dari} dan {data.periode.sampai}, mencakup {data.jumlahPetak}{' '}
            petak seluas {angka(data.totalLuasTerdataHa)} hektar. Produktivitas diukur dengan
            metode ubinan 2,5 × 2,5 meter.
          </Text>
        </Box>

        {/* Angka pokok */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
          <Box>
            <Text
              fw={700}
              c="green.9"
              style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', lineHeight: 1 }}
            >
              {angka(data.rataProduktivitasTonPerHa)}
            </Text>
            <Text size="lg" c="dimmed" mt={4}>
              ton per hektar
            </Text>
            <Text size="sm" c="dimmed" mt="sm" style={{ maxWidth: '40ch' }}>
              Rata-rata hasil panen tertimbang luas lahan. Inilah satu-satunya angka yang
              diukur; seluruh nilai rupiah di bawah diturunkan darinya.
            </Text>
          </Box>

          <Stack gap={0} justify="center">
            {[
              ['Total hasil panen tercatat', `${angka(data.totalHasilKg, 0)} kg`],
              ['Petak terdokumentasi', `${data.jumlahPetak} petak`],
              [
                'Kerugian hama yang dilaporkan petani',
                data.kerugianHamaTercatat.tersedia
                  ? `${persen(data.kerugianHamaTercatat.rataFraksi ?? 0)} dari ${data.kerugianHamaTercatat.jumlahLaporan} laporan`
                  : 'belum diisi',
              ],
            ].map(([label, nilai]) => (
              <Group key={label} justify="space-between" py="xs" wrap="nowrap">
                <Text size="sm" c="dimmed">
                  {label}
                </Text>
                <Text size="sm" fw={600} ta="right">
                  {nilai}
                </Text>
              </Group>
            ))}
          </Stack>
        </SimpleGrid>

        <Divider />

        {/* Asumsi */}
        <Box>
          <Title order={2} size="h3">
            Dari mana angkanya
          </Title>
          <Text size="sm" c="dimmed" mt={4} mb="md" style={{ maxWidth: '68ch' }}>
            Perhitungan di halaman ini memakai lima ketetapan berikut. Ubah nilainya lewat
            basis data, dan seluruh angka ikut berubah.
          </Text>
          <Table striped withTableBorder verticalSpacing="xs" fz="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ketetapan</Table.Th>
                <Table.Th ta="right">Nilai</Table.Th>
                <Table.Th>Sumber</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Kerugian hama sebelum program</Table.Td>
                <Table.Td ta="right">
                  {persen(asumsi.kerugianBaselineMin)}–{persen(asumsi.kerugianBaselineMaks)}
                </Table.Td>
                <Table.Td>{asumsi.sumber.kerugianBaseline}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Target kerugian setelah program</Table.Td>
                <Table.Td ta="right">{persen(asumsi.kerugianTarget)}</Table.Td>
                <Table.Td>{asumsi.sumber.kerugianTarget}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Harga gabah kering panen</Table.Td>
                <Table.Td ta="right">{rupiah(asumsi.hargaGabahPerKg)}/kg</Table.Td>
                <Table.Td>{asumsi.sumber.hargaGabahPerKg}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Luas lahan pilot</Table.Td>
                <Table.Td ta="right">{angka(asumsi.luasPilotHa)} ha</Table.Td>
                <Table.Td>Lahan percontohan program</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Luas sawah kalurahan</Table.Td>
                <Table.Td ta="right">{angka(asumsi.luasTotalHa)} ha</Table.Td>
                <Table.Td>{asumsi.sumber.luasTotalHa}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Box>

        {/* Sebelum & sesudah */}
        <Box>
          <Title order={2} size="h3" mb="md">
            Sebelum dan sesudah pengendalian hama
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Card withBorder padding="lg" bg="yellow.0">
              <Text fw={600} c="yellow.9" mb="sm">
                Sebelum
              </Text>
              <Text fw={700} style={{ fontSize: '2rem', lineHeight: 1.1 }}>
                {angka(sebelum.hasilTonPerHa)} ton/ha
              </Text>
              <Text size="sm" c="dimmed" mb="md">
                hasil yang benar-benar sampai ke petani
              </Text>
              <Baris
                label="Potensi tanpa serangan hama"
                nilai={`${angka(sebelum.skenarioMaks.hasilPotensialTonPerHa)} ton/ha`}
              />
              <Baris
                label="Hilang akibat hama"
                nilai={`${angka(sebelum.skenarioMaks.kerugianTonPerHa)} ton/ha`}
              />
              <Baris
                label="Nilai kerugian di lahan pilot"
                nilai={`${rupiah(sebelum.skenarioMin.kerugianRupiahPilot)} – ${rupiah(sebelum.skenarioMaks.kerugianRupiahPilot)}`}
                tegas
              />
            </Card>

            <Card withBorder padding="lg" bg="green.0">
              <Text fw={600} c="green.9" mb="sm">
                Bila kerugian ditekan ke {persen(sesudah.tingkatKerugian)}
              </Text>
              <Text fw={700} style={{ fontSize: '2rem', lineHeight: 1.1 }}>
                {angka(sesudah.hasilTonPerHaMaks)} ton/ha
              </Text>
              <Text size="sm" c="dimmed" mb="md">
                hasil yang bisa dicapai di lahan pilot
              </Text>
              <Baris
                label="Kenaikan hasil"
                nilai={`${angka(penghematan.kenaikanTonPerHaMaks)} ton/ha`}
              />
              <Baris
                label="Setara tambahan gabah"
                nilai={`${angka(penghematan.kenaikanTonPerHaMaks * 1000 * asumsi.luasPilotHa, 0)} kg`}
              />
              <Baris
                label="Nilai penghematan per musim"
                nilai={`${rupiah(penghematan.rupiahPilotMin)} – ${rupiah(penghematan.rupiahPilotMaks)}`}
                tegas
              />
            </Card>
          </SimpleGrid>
          <Text size="xs" c="dimmed" mt="sm" style={{ maxWidth: '72ch' }}>
            Rentang muncul karena kerugian sebelum program berada di kisaran{' '}
            {persen(asumsi.kerugianBaselineMin)}–{persen(asumsi.kerugianBaselineMaks)}, bukan
            satu angka tunggal. Nilai terendah memakai baseline{' '}
            {persen(asumsi.kerugianBaselineMin)}, tertinggi memakai{' '}
            {persen(asumsi.kerugianBaselineMaks)}.
          </Text>
        </Box>

        {/* Proyeksi */}
        <Paper p="xl" radius="md" bg="green.9" c="white">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
            <Box>
              <Text fw={700} c="yellow.2" style={{ fontSize: '1.9rem', lineHeight: 1.15 }}>
                {rupiah(proyeksiReplikasi.rupiahMin)} – {rupiah(proyeksiReplikasi.rupiahMaks)}
              </Text>
              <Text size="sm" mt="xs" c="green.1" style={{ maxWidth: '40ch' }}>
                tambahan nilai panen per musim bila pengendalian hama diterapkan di seluruh{' '}
                {angka(proyeksiReplikasi.luasHa)} hektar sawah Kalurahan Karangtengah
              </Text>
            </Box>
            <Text size="sm" c="green.1" style={{ alignSelf: 'end' }}>
              Diperoleh dengan mengalikan penghematan di lahan pilot sebesar{' '}
              {angka(proyeksiReplikasi.faktorPengali)}×, yaitu perbandingan luas sawah kalurahan
              terhadap luas lahan pilot. Ini adalah proyeksi, bukan hasil yang sudah terjadi.
            </Text>
          </SimpleGrid>
        </Paper>

        {/* Jejak perhitungan */}
        <Box>
          <Title order={2} size="h3" mb="sm">
            Langkah perhitungan
          </Title>
          <List type="ordered" spacing="xs" size="sm" style={{ maxWidth: '76ch' }}>
            {jejakPerhitungan.map((baris, i) => (
              <List.Item key={i}>{baris}</List.Item>
            ))}
          </List>
        </Box>

        {/* Daftar petak */}
        <Box>
          <Title order={2} size="h3">
            Petak yang masuk perhitungan
          </Title>
          <Text size="sm" c="dimmed" mt={4} mb="md" style={{ maxWidth: '68ch' }}>
            Seluruh {data.jumlahPetak} petak di bawah ini dipakai menghitung rata-rata
            produktivitas.
          </Text>
          <Table.ScrollContainer minWidth={720}>
            <Table striped highlightOnHover withTableBorder verticalSpacing="xs" fz="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Kode petak</Table.Th>
                  <Table.Th>Petani</Table.Th>
                  <Table.Th>Padukuhan</Table.Th>
                  <Table.Th ta="right">Luas (ha)</Table.Th>
                  <Table.Th ta="right">Hasil (kg)</Table.Th>
                  <Table.Th ta="right">Ton/ha</Table.Th>
                  <Table.Th>Panen</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.petakTerdokumentasi.map((p, i) => (
                  <Table.Tr key={`${p.kodePetak}-${i}`}>
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        {p.kodePetak}
                        {p.bagianPilot && (
                          <Badge size="xs" color="green" variant="light">
                            pilot
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>{p.namaPetani}</Table.Td>
                    <Table.Td>{p.padukuhan}</Table.Td>
                    <Table.Td ta="right">{angka(p.luasHa, 3)}</Table.Td>
                    <Table.Td ta="right">{angka(p.hasilKg, 0)}</Table.Td>
                    <Table.Td ta="right">{angka(p.produktivitasTonPerHa)}</Table.Td>
                    <Table.Td>{p.tanggalPanen}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Box>

        <Text size="xs" c="dimmed">
          Halaman ini dihasilkan langsung dari basis data NAWASENA Center. Setiap kali catatan
          panen baru masuk, angkanya dihitung ulang.
        </Text>
      </Stack>
    </Container>
  );
};

type BarisProps = { label: string; nilai: string; tegas?: boolean };

const Baris = ({ label, nilai, tegas }: BarisProps) => (
  <Group
    justify="space-between"
    align="flex-start"
    wrap="nowrap"
    py={6}
    style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
  >
    <Text size={tegas ? 'sm' : 'xs'} c="dimmed">
      {label}
    </Text>
    <Text size="sm" fw={tegas ? 700 : 600} ta="right">
      {nilai}
    </Text>
  </Group>
);
