import { useState, useRef } from 'react';
import type { Track } from '@/lib/types';

interface FileUploadProps {
  onFileSelect: (track: Track) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('audioFile', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      const track: Track = {
        id: data.trackId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Unknown Artist',
        album: 'Uploaded',
        duration: data.duration || 0,
        fileUrl: data.fileUrl,
        fileName: file.name,
      };

      onFileSelect(track);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full rounded-2xl bg-primary px-5 py-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? 'Uploading audio...' : 'Upload audio file'}
      </button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Select an audio file to play in the room. Supported: MP3, WAV, FLAC, AAC (max 50MB).
      </p>
    </div>
  );
}
