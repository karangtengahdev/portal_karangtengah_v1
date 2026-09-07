import { useState } from 'react';
import {
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandTwitter,
  IconLink,
  IconCheck,
} from '@tabler/icons-react';

type ShareButtonsProps = {
  title: string;
  url: string;
};

export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const waLink = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
  const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API bisa gagal (browser lama/http tanpa https) --
      // diamkan saja, tombol lain (WA/FB/Twitter) tetap berfungsi.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-sm font-bold text-[#6C757D]">Bagikan:</span>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke WhatsApp"
        title="Bagikan ke WhatsApp"
        className="grid h-10 w-10 place-items-center rounded-full border border-[#e5ecdf] text-[#25D366] transition hover:bg-[#25D366]/10 hover:border-[#25D366]/40"
      >
        <IconBrandWhatsapp size={19} stroke={1.8} />
      </a>

      <a
        href={fbLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke Facebook"
        title="Bagikan ke Facebook"
        className="grid h-10 w-10 place-items-center rounded-full border border-[#e5ecdf] text-[#1877F2] transition hover:bg-[#1877F2]/10 hover:border-[#1877F2]/40"
      >
        <IconBrandFacebook size={19} stroke={1.8} />
      </a>

      <a
        href={twLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke Twitter/X"
        title="Bagikan ke Twitter/X"
        className="grid h-10 w-10 place-items-center rounded-full border border-[#e5ecdf] text-[#101708] transition hover:bg-[#101708]/8"
      >
        <IconBrandTwitter size={19} stroke={1.8} />
      </a>

      <button
        onClick={handleCopy}
        type="button"
        aria-label="Salin tautan"
        title="Salin tautan"
        className="grid h-10 w-10 place-items-center rounded-full border border-[#e5ecdf] text-[#4f842f] transition hover:bg-[#4f842f]/10 hover:border-[#4f842f]/40"
      >
        {copied ? <IconCheck size={19} stroke={2} /> : <IconLink size={19} stroke={1.8} />}
      </button>

      {copied && <span className="text-xs font-semibold text-[#4f842f]">Tautan disalin!</span>}
    </div>
  );
};
