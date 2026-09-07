// Kompres & resize gambar DI BROWSER sebelum upload -- supaya foto
// dari HP (yang gampang 3-8MB) tidak kena limit keras 4.5MB milik
// Vercel Serverless Functions (limit ini TIDAK BISA dinaikkan, jadi
// solusinya perkecil file-nya sebelum sampai ke server, bukan minta
// naikkan limit di backend).
//
// Cara kerja: gambar digambar ulang ke <canvas> dgn dimensi maksimum
// yg ditentukan, lalu diekspor sbg JPEG dgn kualitas tertentu --
// hasilnya JAUH lebih kecil, biasanya di bawah 500KB-1MB utk foto HP
// standar, dgn penurunan kualitas visual yg nyaris tidak terlihat.
export const compressImage = (
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Kalau bukan gambar (mis. GIF animasi jarang, atau file lain),
    // jangan dipaksa proses -- kirim apa adanya.
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // fallback: kirim file asli kalau canvas gagal
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            // Nama file dipertahankan, ekstensi diseragamkan ke .jpg
            // krn hasil toBlob JPEG (kompres lebih efektif dari PNG
            // utk foto biasa).
            const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], newName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality,
        );
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar untuk dikompres.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });
};
