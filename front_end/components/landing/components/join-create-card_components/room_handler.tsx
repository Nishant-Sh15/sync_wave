import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ButtonSection from './buttonSection';
import RoomInputHandler from './roomInputHandler';
import axios from 'axios';

export default function RoomHandler() {
    const router = useRouter();
    const [mode, setMode] = useState<'join' | 'create'>('join');
    const [roomCode, setRoomCode] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState(false);

    const handleJoin = async () => {
        if (roomCode && userName) {
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/checks`, {
                headers: {
                    "room-id": roomCode,
                    "user-name": userName   
                },
                withCredentials: true
            })
                .then((response) => {
                    if (response.data.exists) {
                        // Store userId in localStorage for session persistence
                        localStorage.setItem('userId', response.data.userId);
                        console.log(localStorage.getItem('userId'));
                        
                        router.push(`/room/${roomCode}`);
                    } else {
                        setError(true);
                    }
                    console.log(response);
                    console.log(localStorage);
                })
                .catch((error) => {
                    setError(true);
                    console.error("Join error:", error);
                });
        }
    };

    const handleCreate = () => {
        if (userName) {
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create-room`,{
                headers: {
                    "user-name": userName   
                },
                withCredentials: true
            })
                .then((response) => {
                    // Store userId in localStorage for session persistence
                    localStorage.setItem('userId', response.data.userId);
                    const code = response.data.roomId;
                    router.push(`/room/${code}`);
                })
                .catch((error) => {
                    setError(true);
                    console.error("Create room error:", error);
                });
        }
    };

    const handleModeChange = (newMode: 'join' | 'create') => {
        setMode(newMode);
        setError(false);
    };

    return <>
        {/* -----------button handling ----------- */}
        <ButtonSection  mode={mode} onModeChange={handleModeChange} userName={userName} />
        {/* -----------input handling ----------- */}
        <RoomInputHandler
            handleJoin={handleJoin}
            handleCreate={handleCreate}
            mode={mode}
            roomCode={roomCode}
            setRoomCode={setRoomCode}
            userName={userName}
            setUserName={setUserName}
            error={error}
        />
    </>
}