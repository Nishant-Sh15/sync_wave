'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import HeaderNavbar from '@/components/room/header-navbar';
import MembersSidebar from '@/components/room/members-sidebar';
import MusicPlayer from '@/components/room/music-player';
import { createMockRoom, mockTracks } from '@/lib/mock-data';
import type { Room, Track } from '@/lib/types';

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.id as string;
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
    if (room) {
      setRoom({
        ...room,
        currentTrack: selectedTrack,
        currentTime: 0,
        isPlaying: true,
      });
    }
  };

  if (!mounted || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading room...</p>
      </div>
    );
  }

  const handleTogglePlayback = () => {
    setRoom({
      ...room,
      isPlaying: !room.isPlaying,
    });
  };

  const handleTimeChange = (time: number) => {
    setRoom({
      ...room,
      currentTime: time,
    });
  };

  const handleVolumeChange = (volume: number) => {
    setRoom({
      ...room,
      volume,
    });
  };

  const handleNextTrack = () => {
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
    if (room.currentTime > 3) {
      setRoom({
        ...room,
        currentTime: 0,
      });
    } else {
      const currentIndex = mockTracks.findIndex((t) => t.id === room.currentTrack?.id);
      const prevIndex = currentIndex === 0 ? mockTracks.length - 1 : currentIndex - 1;
      setRoom({
        ...room,
        currentTrack: mockTracks[prevIndex],
        currentTime: 0,
        isPlaying: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <HeaderNavbar
        roomName={room.name}
        roomCode={room.code}
        userName="You"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Members Sidebar */}
        <MembersSidebar
          members={room.members}
          currentUserId={room.currentUserId}
        />

        {/* Music Player */}
        <MusicPlayer
          track={room.currentTrack}
          isPlaying={room.isPlaying}
          currentTime={room.currentTime}
          duration={room.currentTrack?.duration || 0}
          volume={room.volume}
          onTogglePlayback={handleTogglePlayback}
          onPrevious={handlePrevTrack}
          onNext={handleNextTrack}
          onTimeChange={handleTimeChange}
          onVolumeChange={handleVolumeChange}
          onSelectTrack={handleSelectTrack}
        />
      </div>
    </div>
  );
}
