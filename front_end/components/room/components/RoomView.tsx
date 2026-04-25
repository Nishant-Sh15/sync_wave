'use client';

import HeaderNavbar from '@/components/room/header-navbar';
import MembersSidebar from '@/components/room/members-sidebar';
import MusicPlayer from '@/components/room/music-player';
import type { Room, Track } from '@/lib/types';

interface RoomViewProps {
  room: Room;
  userName: string;
  onTogglePlayback: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeChange: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onSelectTrack: (track: Track) => void;
}

export default function RoomView({
  room,
  userName,
  onTogglePlayback,
  onPrevious,
  onNext,
  onTimeChange,
  onVolumeChange,
  onSelectTrack,
}: RoomViewProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderNavbar roomCode={room.roomId} userName={userName} />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <MembersSidebar members={room.members} currentUserId={userName} />

        <MusicPlayer
          track={undefined} // TODO: Implement track lookup from currentTrack string
          isPlaying={room.isPlaying || false}
          currentTime={room.currentTime || 0}
          duration={0} // TODO: Implement track duration lookup
          volume={room.volume || 70}
          onTogglePlayback={onTogglePlayback}
          onPrevious={onPrevious}
          onNext={onNext}
          onTimeChange={onTimeChange}
          onVolumeChange={onVolumeChange}
          onSelectTrack={onSelectTrack}
        />
      </div>
    </div>
  );
}
