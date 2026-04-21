import type { User, Room, Track } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'You',
    avatar: '👤',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Alex Chen',
    avatar: '😊',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Sarah Williams',
    avatar: '🎵',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Jordan Smith',
    avatar: '🎧',
    isOnline: false,
  },
  {
    id: '5',
    name: 'Casey Parker',
    avatar: '🎹',
    isOnline: true,
  },
];

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    album: 'Nocturne Sessions',
    duration: 243,
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Digital Horizons',
    artist: 'Synth Wave',
    album: 'Neon Future',
    duration: 256,
    albumArt: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Velvet Sky',
    artist: 'Aurora Borealis',
    album: 'Night Lights',
    duration: 234,
    albumArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Electric Pulse',
    artist: 'Nova Sound',
    album: 'Circuit Breaker',
    duration: 267,
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'Neon Nights',
    artist: 'Cyber Dreams',
    album: 'Digital Echoes',
    duration: 245,
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    title: 'Starlight Symphony',
    artist: 'Celestial Harmony',
    album: 'Cosmic Waves',
    duration: 278,
    albumArt: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop',
  },
  {
    id: '7',
    title: 'Ocean Breeze',
    artist: 'Wave Riders',
    album: 'Coastal Vibes',
    duration: 251,
    albumArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
  },
];

export const createMockRoom = (roomId: string): Room => ({
  id: roomId,
  name: 'Late Night Vibes',
  code: 'MUSIC2024',
  currentUserId: '1',
  members: mockUsers,
  currentTrack: mockTracks[0],
  isPlaying: true,
  currentTime: 45,
  duration: 243,
  volume: 70,
});
