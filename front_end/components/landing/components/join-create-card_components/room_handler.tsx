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
                }
            })
                .then((response) => {
                    if (response.data.exists) {
                        router.push(`/room/${roomCode}?user=${encodeURIComponent(userName)}`);
                    } else {
                        setError(true);
                    }
                });
        }
    };

    const handleCreate = () => {
        if (userName) {
            axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create-room`,{
                headers: {
                    "user-name": userName   
                }
            })
                .then((response) => {
                    const code = response.data.roomId;
                    router.push(`/room/${code}?user=${encodeURIComponent(userName)}`);
                })
                .catch((error) => {
                    setError(true);
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