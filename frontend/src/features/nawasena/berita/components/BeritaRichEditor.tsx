import { useEffect, useRef } from 'react';
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

// Editor isi berita -- pakai @mantine/tiptap (paket resmi Mantine, jadi
// tampilannya otomatis nyambung tanpa perlu styling ulang). Tombol
// standar (tebal, miring, heading, list, link) bawaan library; tombol
// SISIP GAMBAR itu custom -- buka file picker, upload ke backend
// (endpoint upload-image), lalu sisipkan URL hasilnya di posisi kursor.
export const BeritaRichEditor = ({ value, onChange }: BeritaRichEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TiptapImage.configure({ inline: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sinkronkan isi editor kalau `value` berubah dari LUAR (mis. modal
  // dibuka ulang utk edit artikel LAIN) -- tanpa ini, editor tidak ikut
  // ter-reset dan masih menampilkan isi artikel sebelumnya.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
