import { useState } from 'react';

const MAX_PHOTOS = 10;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function usePhotoUpload() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoErrors, setPhotoErrors] = useState<string | null>(null);

  const addFiles = (files: File[]) => {
    // Silent trim: oversized files just get dropped, no message.
    const sizeOk = files.filter((f) => f.size <= MAX_SIZE);
    setPhotos((prev) => {
      const combined = [...prev, ...sizeOk];
      if (combined.length > MAX_PHOTOS) {
        setPhotoErrors(`You can only upload up to ${MAX_PHOTOS} photos.`);
        return combined.slice(0, MAX_PHOTOS);
      }
      setPhotoErrors(null);
      return combined;
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    // Reset so selecting the same file again still fires onChange.
    e.target.value = '';
  };

  const handlePhotoDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files ?? []).filter((f) => f.type.startsWith('image/'));
    addFiles(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return { photos, photoErrors, handlePhotoChange, handlePhotoDrop, handleDragOver, removePhoto };
}
