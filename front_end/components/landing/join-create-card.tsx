'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function JoinCreateCard() {
  const router = useRouter();
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');

  const handleJoin = () => {
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.toUpperCase()}`);
    }
  };

  const handleCreate = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/room/${code}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8 bg-card backdrop-blur-sm border border-border/40">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Music Room</h1>
          <p className="text-muted-foreground">Listen together, sync vibes</p>
        </div>

        <div className="flex gap-2 rounded-lg bg-muted p-1">
          <button
            onClick={() => setMode('join')}
            className={`flex-1 py-2 px-4 rounded font-medium transition-all ${
              mode === 'join'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Join Room
          </button>
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 px-4 rounded font-medium transition-all ${
              mode === 'create'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Room
          </button>
        </div>

        <div className="space-y-4">
          {mode === 'join' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Room Code</label>
                <Input
                  placeholder="Enter room code (e.g. MUSIC2024)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                  className="bg-input border-border"
                />
              </div>
              <Button onClick={handleJoin} className="w-full" disabled={!roomCode.trim()}>
                Join Room
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Room Name (Optional)</label>
                <Input
                  placeholder="Give your room a name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create New Room
              </Button>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-border/30 text-center text-xs text-muted-foreground">
          Made with music and code ✨
        </div>
      </div>
    </Card>
  );
}
