import React, { useEffect, useState } from 'react';
import { Modal, TextInput, NumberInput, Textarea, Button, Group } from '@mantine/core';
import type { CreateTahapanPayload, TahapanJadwal } from '../types/plantingSchedule';

interface TahapanModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTahapanPayload) => Promise<boolean>;
  initialData?: TahapanJadwal;
}

export const TahapanModal: React.FC<TahapanModalProps> = ({
  opened,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [namaTahapan, setNamaTahapan] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [urutan, setUrutan] = useState<number | string>(1);
  const [deskripsi, setDeskripsi] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (opened) {
      if (initialData) {
        setNamaTahapan(initialData.namaTahapan);
        setTanggalMulai(initialData.tanggalMulai ? initialData.tanggalMulai.split('T')[0] : '');
        setTanggalSelesai(initialData.tanggalSelesai ? initialData.tanggalSelesai.split('T')[0] : '');
        setUrutan(initialData.urutan);
        setDeskripsi(initialData.deskripsi || '');
      } else {
        setNamaTahapan('');
        setTanggalMulai('');
        setTanggalSelesai('');
        setUrutan(1);
        setDeskripsi('');
      }
    }
  }, [opened, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggalMulai || typeof urutan !== 'number') return;
    
    setSubmitting(true);
    
    const payload: CreateTahapanPayload = {
      namaTahapan,
      tanggalMulai: new Date(tanggalMulai).toISOString(),
      tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai).toISOString() : undefined,
      urutan,
      deskripsi: deskripsi || undefined,
    };

    const success = await onSubmit(payload);
    setSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={initialData ? 'Edit Tahapan' : 'Tambah Tahapan'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Nama Tahapan"
          placeholder="Contoh: Persiapan Lahan"
          required
          value={namaTahapan}
          onChange={(e) => setNamaTahapan(e.target.value)}
        />
        
        <NumberInput
          label="Urutan"
          required
          min={1}
          value={urutan}
          onChange={(val) => setUrutan(val)}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Tanggal Mulai"
            type="date"
            required
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
          />
          <TextInput
            label="Tanggal Selesai"
            type="date"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
          />
        </div>
        
        <Textarea
          label="Deskripsi"
          placeholder="Keterangan tambahan (opsional)"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={3}
        />
        
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={submitting}>Batal</Button>
          <Button type="submit" color="green" loading={submitting}>Simpan</Button>
        </Group>
      </form>
    </Modal>
  );
};
