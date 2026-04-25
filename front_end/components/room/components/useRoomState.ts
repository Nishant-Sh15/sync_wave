'use client';

import { useEffect, useState } from 'react';
import { mockTracks } from '@/lib/mock-data';
import type { Room, Track } from '@/lib/types';

export function useRoomState(roomId?: string, authRoom?: Room | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (roomId && authRoom) {
      // Use authenticated room data with playback defaults
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
    if (!room) return;

    const currentIndex = mockTracks.findIndex((t) => t.id === room.currentTrack);
    const nextIndex = (currentIndex + 1) % mockTracks.length;

    setRoom({
      ...room,
      currentTrack: mockTracks[nextIndex].id,
      currentTime: 0,
      isPlaying: true,
    });
  };

  const handlePrevTrack = () => {
    if (!room) return;

    if ((room.currentTime || 0) > 3) {
      setRoom({
        ...room,
        currentTime: 0,
      });
      return;
    }

    const currentIndex = mockTracks.findIndex((t) => t.id === room.currentTrack);
    const prevIndex = currentIndex === 0 ? mockTracks.length - 1 : currentIndex - 1;

    setRoom({
      ...room,
      currentTrack: mockTracks[prevIndex].id,
      currentTime: 0,
      isPlaying: true,
    });
  };

  return {
    room,
    mounted,
    handleSelectTrack,
    handleTogglePlayback,
    handleTimeChange,
    handleVolumeChange,
    handleNextTrack,
    handlePrevTrack,
  };
}
