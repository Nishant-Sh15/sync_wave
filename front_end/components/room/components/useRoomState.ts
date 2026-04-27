'use client';

import { useEffect, useState } from 'react';
import type { Room, Track } from '@/lib/types';

export function useRoomState(roomId?: string, authRoom?: Room | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setMounted(true);
    const storedTracks = localStorage.getItem('uploadedTracks');
    if (storedTracks) {
      try {
        setUploadedTracks(JSON.parse(storedTracks));
      } catch (error) {
        console.error('Error parsing uploaded tracks from localStorage:', error);
        setUploadedTracks([]);
      }
    }
  }, []);

  useEffect(() => {
    if (uploadedTracks.length > 0) {
      localStorage.setItem('uploadedTracks', JSON.stringify(uploadedTracks));
    }
  }, [uploadedTracks]);

  useEffect(() => {
    if (roomId && authRoom) {
      setRoom({
        ...authRoom,
        isPlaying: authRoom.isPlaying || false,
        currentTime: authRoom.currentTime || 0,
        volume: authRoom.volume || 70,
      });
    }
  }, [roomId, authRoom]);

  const handleSelectTrack = (selectedTrack: Track) => {
    if (!room) return;

    setUploadedTracks((prev) => {
      const exists = prev.some((t) => t.id === selectedTrack.id);
      return exists ? prev : [...prev, selectedTrack];
    });

    setRoom({
      ...room,
      currentTrack: selectedTrack.id,
      currentTime: 0,
      isPlaying: true,
    });
  };

  const handleTogglePlayback = () => {
    if (!room) return;
    setRoom({
      ...room,
      isPlaying: !room.isPlaying,
    });
  };

  const handleTimeChange = (time: number) => {
    if (!room) return;
    setRoom({
      ...room,
      currentTime: time,
    });
  };

  const handleVolumeChange = (volume: number) => {
    if (!room) return;
    setRoom({
      ...room,
      volume,
    });
  };

  const handleNextTrack = () => {
    if (!room || uploadedTracks.length === 0) return;

    const currentIndex = uploadedTracks.findIndex((t) => t.id === room.currentTrack);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % uploadedTracks.length;

    setRoom({
      ...room,
      currentTrack: uploadedTracks[nextIndex].id,
      currentTime: 0,
      isPlaying: true,
    });
  };

  const handlePrevTrack = () => {
    if (!room || uploadedTracks.length === 0) return;

    if ((room.currentTime || 0) > 3) {
      setRoom({
        ...room,
        currentTime: 0,
      });
      return;
    }

    const currentIndex = uploadedTracks.findIndex((t) => t.id === room.currentTrack);
    const prevIndex = currentIndex <= 0 ? uploadedTracks.length - 1 : currentIndex - 1;

    setRoom({
      ...room,
      currentTrack: uploadedTracks[prevIndex].id,
      currentTime: 0,
      isPlaying: true,
    });
  };

  return {
    room,
    uploadedTracks,
    mounted,
    handleSelectTrack,
    handleTogglePlayback,
    handleTimeChange,
    handleVolumeChange,
    handleNextTrack,
    handlePrevTrack,
  };
}
