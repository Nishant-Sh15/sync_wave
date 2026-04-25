'use client';

import { useParams, useSearchParams } from 'next/navigation';
import RoomView from '@/components/room/components/RoomView';
import { useRoomState } from '@/components/room/components/useRoomState';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params?.id as string;
  const userName = searchParams?.get('user') || 'You';

  const {
    room,
    mounted,
    handleSelectTrack,
    handleTogglePlayback,
    handleTimeChange,
    handleVolumeChange,
    handleNextTrack,
    handlePrevTrack,
  } = useRoomState(roomId);

  if (!mounted || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading room...</p>
      </div>
    );
  }

  return (
    <RoomView
      room={room}
      userName={userName}
      onTogglePlayback={handleTogglePlayback}
      onPrevious={handlePrevTrack}
      onNext={handleNextTrack}
      onTimeChange={handleTimeChange}
      onVolumeChange={handleVolumeChange}
      onSelectTrack={handleSelectTrack}
    />
  );
}
