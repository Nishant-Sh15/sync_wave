'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import type { Room, User } from '@/lib/types';

export function useRoomAuth(roomId: string) {
  const router = useRouter();
  const [authData, setAuthData] = useState<User & { room: Room } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAccess = async () => {
        
      try {
        // Get userId from localStorage
        const userId = localStorage.getItem('userId');
        console.log("-----------------------------------------------------------------------"+userId);

        // If no userId in session, redirect to landing page
        if (!userId) {
          router.push('/');
          return;
        }

        // Send request to backend for room info and validation
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/info`,
          {
            withCredentials: true,
            headers: {
              'user-id': userId,
              'room-id': roomId,
            },
          }
        );

        // Check if response contains user data
        if (!response.data.user) {
          setError('Invalid response from server');
          setIsLoading(false);
          return;
        }

        const user = response.data.user;

        // Validate that user has a room reference
        if (!user.room) {
          setError('User not associated with a room');
          setIsLoading(false);
          router.push('/');
          return;
        }

        // Extract room data (should be populated by backend)
        const room = typeof user.room === 'object' ? user.room : null;
        if (!room) {
          setError('Room data not populated');
          setIsLoading(false);
          router.push('/');
          return;
        }

        // Validate that user._id exists in room.members
        const userInRoom = room.members?.some((member: any) => {
          if (typeof member === 'string') {
            return member === userId;
          }
          return member._id === userId;
        });

        if (!userInRoom) {
          setError('User not in room members');
          setIsLoading(false);
          router.push('/');
          return;
        }

        // Validation passed
        setAuthData(user as User & { room: Room });
        setError(null);
      } catch (err) {
        console.error('Auth validation error:', err);
        setError('Failed to validate room access');
        // Redirect on error
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      validateAccess();
    }
  }, [roomId, router]);

  return { authData, isLoading, error };
}
