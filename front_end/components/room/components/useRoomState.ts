'use client';

import { useEffect, useState } from 'react';
import { createMockRoom, mockTracks } from '@/lib/mock-data';
import type { Room, Track } from '@/lib/types';

export function useRoomState(roomId?: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (roomId) {
      const mockRoom = createMockRoom(roomId);
      setRoom(mockRoom);
    }
  }, [roomId]);

  const handleSelectTrack = (selectedTrack: Track) => {
    if (!room) return;
    setRoom({
      ...room,
      currentTrack: selectedTrack,
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

    const currentIndex = mockTracks.findIndex((t) => t.id === room.currentTrack?.id);
    const nextIndex = (currentIndex + 1) % mockTracks.length;

    setRoom({
      ...room,
      currentTrack: mockTracks[nextIndex],
      currentTime: 0,
      isPlaying: true,
    });
  };

  const handlePrevTrack = () => {
    if (!room) return;

    if (room.currentTime > 3) {
      setRoom({
        ...room,
        currentTime: 0,
      });
      return;
    }

    const currentIndex = mockTracks.findIndex((t) => t.id === room.currentTrack?.id);
    const prevIndex = currentIndex === 0 ? mockTracks.length - 1 : currentIndex - 1;

    setRoom({
      ...room,
      currentTrack: mockTracks[prevIndex],
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
