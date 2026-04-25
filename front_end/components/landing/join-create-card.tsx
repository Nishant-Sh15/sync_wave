'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Title from './components/join-create-card_components/title';
import RoomHandler from './components/join-create-card_components/room_handler';
export default function JoinCreateCard() {
 

  return (
    <Card className="w-full max-w-md mx-auto p-8 bg-card backdrop-blur-sm border border-border/40">
      <div className="space-y-6">
        <Title />
        <RoomHandler />
        <div className="pt-4 border-t border-border/30 text-center text-xs text-muted-foreground">
          Made with music and code ✨
        </div>
      </div>
    </Card>
  );
}
