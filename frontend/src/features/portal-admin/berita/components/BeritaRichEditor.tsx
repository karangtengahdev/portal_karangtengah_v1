import { useEffect, useMemo, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TiptapImage from '@tiptap/extension-image';
import { IconPhoto } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { uploadInlineImage } from '../api/beritaApi';

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
      StarterKit,
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
      const { url } = await uploadInlineImage(file);
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

        <RichTextEditor.Content mih={220} />
      </RichTextEditor>
    </div>
  );
};
