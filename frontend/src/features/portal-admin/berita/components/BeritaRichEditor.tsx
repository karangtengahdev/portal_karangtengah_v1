import { useEffect, useMemo, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TiptapImage from '@tiptap/extension-image';
import { IconPhoto } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { uploadInlineImage } from '../api/beritaApi';
import { compressImage } from '../../../../shared/utils/compressImage';

type BeritaRichEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export const BeritaRichEditor = ({ value, onChange }: BeritaRichEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PERBAIKAN UTAMA: extensions dibungkus useMemo (deps kosong) supaya
  // array-nya PUNYA IDENTITAS YANG SAMA di setiap render. Sebelumnya
  // ini array baru dibuat tiap render -- Tiptap membaca itu sbg
  // "konfigurasi ganti", lalu diam-diam BIKIN EDITOR BARU dari nol
  // di tengah sesi. Itu penyebab asli teks yang baru diketik hilang/
  // tidak nempel ke form -- bukan soal "belum update sekali render".
  const extensions = useMemo(
    () => [
      // link & underline DIMATIKAN dari StarterKit -- versi terbaru
      // StarterKit ternyata sudah menyertakan keduanya secara bawaan,
      // bentrok dengan Underline & Link yang saya tambahkan terpisah
      // di bawah (perlu terpisah spy cocok dgn tombol toolbar Mantine).
      // Tanpa ini muncul warning "Duplicate extension names" di console.
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TiptapImage.configure({ inline: false }),
    ],
    [],
  );

  // Deps kosong [] di argumen ke-2 useEditor -- pastikan editor DIBUAT
  // SEKALI SAJA seumur hidup komponen ini, tidak peduli apa pun yang
  // berubah di parent. Ini pola resmi yang direkomendasikan Tiptap
  // utk kasus dimana konten perlu disinkron dari luar (lihat useEffect
  // di bawah), bukan lewat prop `content` yang cuma dibaca sekali.
  const editor = useEditor(
    {
      extensions,
      content: value,
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
    },
    [],
  );

  // Sinkronkan isi editor kalau `value` berubah dari LUAR (mis. modal
  // dibuka utk edit artikel lain, atau load data awal). Aman dari
  // bentrok dgn ketikan user sendiri: saat user ngetik, onUpdate sudah
  // duluan bikin editor.getHTML() SAMA PERSIS dgn value baru, jadi
  // pengecekan di bawah otomatis skip (tidak reset kursor/ketikan).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  const handlePickImage = () => fileInputRef.current?.click();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      // Kompres dulu SEBELUM upload -- foto asli dari HP gampang
      // >4.5MB (limit keras Vercel Serverless), yang manifest sbg
      // error CORS di browser (bukan error ukuran yg jelas), krn
      // request-nya ditolak Vercel sebelum sempat sampai ke Express/
      // NestJS yg sudah benar setting CORS-nya.
      const compressed = await compressImage(file);
      const { url } = await uploadInlineImage(compressed);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      notifications.show({
        title: 'Gagal',
        message: 'Gagal mengunggah gambar ke isi berita. Coba lagi.',
        color: 'red',
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Blockquote />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
            <RichTextEditor.Control
              onClick={handlePickImage}
              aria-label="Sisipkan gambar"
              title="Sisipkan gambar"
            >
              <IconPhoto size={16} stroke={1.5} />
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        {/* PERBAIKAN: tambah class "prose" (Tailwind Typography) --
            sama persis dgn yg dipakai halaman publik BeritaDetailPage.
            Tanpa ini, Tailwind's base reset menghapus tampilan bawaan
            utk list (bullet/nomor jadi tidak muncul), link (warna &
            garis bawah hilang), dan miring (kurang jelas kelihatan) --
            DATANYA tetap benar tersimpan (makanya tampil benar di
            halaman publik yang SUDAH pakai .prose), cuma editornya
            sendiri tidak menunjukkan itu sedang dipakai. */}
        <RichTextEditor.Content className="prose prose-sm sm:prose-base max-w-none" mih={220} />
      </RichTextEditor>
    </div>
  );
};
