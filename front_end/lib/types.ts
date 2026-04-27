// Backend Models (from MongoDB)
export interface User {
  _id: string;
  name: string;
  room: string | Room; // Reference to Room, can be populated or just ID
}

export interface Room {
  _id: string;
  roomId: string;
  members: (string | User)[]; // Array of User references, can be populated or just IDs
  owner: string | User; // User reference
  currentTrack: string;
  // UI State (not persisted in DB)
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  volume?: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  albumArt?: string;
  fileUrl?: string; // URL to the uploaded audio file
  fileName?: string; // Original filename
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
