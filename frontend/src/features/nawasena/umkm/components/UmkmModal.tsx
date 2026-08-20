import { useEffect, useState } from 'react';
import { Modal, TextInput, Textarea, Select, Button, Group, Stack, FileInput, Divider, ActionIcon, Grid, NumberInput } from '@mantine/core';
import { IconBuildingStore, IconPhoto, IconPlus, IconShoppingCart, IconTrash } from '@tabler/icons-react';
import type { UmkmItem, UmkmPayload, UmkmProduct } from '../types/umkm';

type UmkmModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: UmkmPayload, file: File | null) => Promise<void>;
  initialData?: UmkmItem | null;
  isSubmitting: boolean;
};

const INITIAL_PRODUCT: UmkmProduct = { name: '', price: 0, unit: 'pcs', stock: 0, note: '' };

const sectionLabelClass =
  'text-xs font-semibold uppercase tracking-[0.14em] text-[#8A5A3B] flex items-center gap-1.5';

export const UmkmModal = ({ opened, onClose, onSubmit, initialData, isSubmitting }: UmkmModalProps) => {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('makanan');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // State Dinamis untuk Array Produk
  const [products, setProducts] = useState<UmkmProduct[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setOwnerName(initialData.ownerName);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setContactPhone(initialData.contactPhone);
      setContactAddress(initialData.contactAddress);
      setProducts(initialData.products || []);
    } else {
      setName(''); setOwnerName(''); setDescription('');
      setCategory('makanan'); setContactPhone(''); setContactAddress('');
      setProducts([{ ...INITIAL_PRODUCT }]); // Berikan 1 form produk kosong default
    }
    setCoverFile(null);
  }, [initialData, opened]);

  const handleProductChange = (index: number, field: keyof UmkmProduct, value: string | number) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const addProduct = () => setProducts([...products, { ...INITIAL_PRODUCT }]);
  const removeProduct = (index: number) => setProducts(products.filter((_, i) => i !== index));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(
      { name, ownerName, description, category, contactPhone, contactAddress, products },
      coverFile
    );
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <span className="text-lg font-semibold text-[#1C2620]">
          {initialData ? 'Edit UMKM' : 'Tambah UMKM Baru'}
        </span>
      }
      size="xl"
      centered
      radius="md"
      classNames={{ content: "font-['Plus_Jakarta_Sans']" }}
    >
      <form onSubmit={handleFormSubmit}>
        <Stack gap="lg">
          <div>
            <p className={sectionLabelClass}>
              <IconBuildingStore size={14} /> Identitas Usaha
            </p>
            <Divider mt={6} mb="sm" color="#EDEAE0" />
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="sm">
                  <TextInput label="Nama Usaha (UMKM)" placeholder="Keripik Tela Bu Sari" value={name} onChange={(e) => setName(e.target.value)} required />
                  <TextInput label="Nama Pemilik" placeholder="Ibu Sari" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
                  <Select label="Kategori" data={['makanan', 'minuman', 'kerajinan', 'jasa', 'lainnya']} value={category} onChange={(val) => setCategory(val || 'makanan')} required />
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="sm">
                  <TextInput label="Nomor Telepon/WA" placeholder="08123456789" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
                  <Textarea label="Alamat Lengkap" placeholder="Padukuhan Karangtengah RT 01" value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} rows={2} required />
                  <Textarea label="Deskripsi Singkat" placeholder="Penjelasan singkat mengenai UMKM..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} required />
                </Stack>
              </Grid.Col>
            </Grid>
          </div>

          <div className="rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/10 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[#8A5A3B]">
              <IconPhoto size={16} /> Foto Usaha / Cover
            </p>
            <FileInput
              className="mt-3"
              placeholder="Pilih file gambar (Opsional)"
              leftSection={<IconPhoto size={16} />}
              value={coverFile}
              onChange={setCoverFile}
              accept="image/*"
              clearable
              size="sm"
            />
          </div>

          <div>
            <p className={sectionLabelClass}>
              <IconShoppingCart size={14} /> Daftar Produk
            </p>
            <Divider mt={6} mb="sm" color="#EDEAE0" />
            <Stack gap="sm">
              {products.map((product, index) => (
                <div key={index} className="flex flex-col gap-2 bg-[#F7F6EF] p-3 rounded-md border border-neutral-200 sm:flex-row sm:items-start sm:gap-3">
                  <Grid className="flex-1">
                    <Grid.Col span={{ base: 12, sm: 4 }}><TextInput label="Nama Produk" placeholder="Keripik Original" value={product.name} onChange={(e) => handleProductChange(index, 'name', e.target.value)} required size="xs" /></Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}><NumberInput label="Harga" placeholder="12000" value={product.price} onChange={(val) => handleProductChange(index, 'price', Number(val))} min={0} required size="xs" /></Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 2 }}><TextInput label="Satuan" placeholder="bungkus/kg" value={product.unit} onChange={(e) => handleProductChange(index, 'unit', e.target.value)} required size="xs" /></Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}><NumberInput label="Stok" placeholder="50" value={product.stock} onChange={(val) => handleProductChange(index, 'stock', Number(val))} min={0} required size="xs" /></Grid.Col>
                  </Grid>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    className="self-end sm:self-start sm:mt-6"
                    onClick={() => removeProduct(index)}
                    disabled={products.length === 1}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </div>
              ))}
              <Button
                variant="outline"
                size="xs"
                leftSection={<IconPlus size={16} />}
                onClick={addProduct}
                className="w-fit"
                styles={{ root: { color: '#1F4A34', borderColor: '#1F4A34' } }}
              >
                Tambah Produk Lain
              </Button>
            </Stack>
          </div>

          <Group justify="flex-end" mt="sm" className="border-t border-neutral-100 pt-4 flex-col-reverse gap-2 sm:flex-row sm:gap-0">
            <Button variant="subtle" color="gray" onClick={onClose} disabled={isSubmitting} fullWidth className="sm:w-auto">Batal</Button>
            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
              className="sm:w-auto"
              styles={{ root: { backgroundColor: '#1F4A34', '&:hover': { backgroundColor: '#173a29' } } }}
            >
              {initialData ? 'Simpan Perubahan' : 'Daftarkan UMKM'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};