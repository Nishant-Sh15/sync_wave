'use client';

import { useParams, useSearchParams } from 'next/navigation';
import RoomView from '@/components/room/components/RoomView';
import { useRoomState } from '@/components/room/components/useRoomState';
import { useRoomAuth } from '@/components/room/components/useRoomAuth';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params?.id as string;
  // const userName = searchParams?.get('user') || 'You';
  console.log('Room ID from params:', roomId);

  // Validate room access and get authenticated room/user data
  const { authData, isLoading, error } = useRoomAuth(roomId);

  // Use room state for playback controls
  const {
    room,
    mounted,
    handleSelectTrack,
    handleTogglePlayback,
    handleTimeChange,
    handleVolumeChange,
    handleNextTrack,
    handlePrevTrack,
  } = useRoomState(roomId, authData?.room);


  // Show loading state while validating access
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Validating access...</p>
        </div>
      </div>
    );
  }

  // Show error or redirect happens automatically in useRoomAuth
  if (error || !authData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading room...</p>
      </div>
    );
  }

  if (!mounted || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </div>
    );
  }
  
  return (
    <RoomView
      room={room}
      userName={authData.name || "You"}
      onTogglePlayback={handleTogglePlayback}
      onPrevious={handlePrevTrack}
      onNext={handleNextTrack}
      onTimeChange={handleTimeChange}
      onVolumeChange={handleVolumeChange}
      onSelectTrack={handleSelectTrack}
    />
  );
}
