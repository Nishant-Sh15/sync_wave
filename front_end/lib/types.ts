export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  currentUserId: string;
  members: User[];
  currentTrack?: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  albumArt?: string;
}

export interface RoomContextType {
  room: Room;
  setRoom: (room: Room) => void;
  playTrack: (track: Track) => void;
  togglePlayback: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}
