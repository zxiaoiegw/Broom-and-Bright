import { useState } from 'react';

const MAX_PHOTOS = 10;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function usePhotoUpload() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoErrors, setPhotoErrors] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    // Silent trim: oversized files just get dropped, no message.
    const sizeOk = files.filter((f) => f.size <= MAX_SIZE);
    const combined = [...photos, ...sizeOk];

    if (combined.length > MAX_PHOTOS) {
      setPhotoErrors(`You can only upload up to ${MAX_PHOTOS} photos.`);
      setPhotos(combined.slice(0, MAX_PHOTOS));
    } else {
      setPhotoErrors(null);
      setPhotos(combined);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return { photos, photoErrors, handlePhotoChange, removePhoto };
}
