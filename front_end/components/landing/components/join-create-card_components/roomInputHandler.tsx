import {Input} from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RoomInputHandler({
    handleJoin,
    handleCreate,
    mode,
    roomCode,
    setRoomCode,
    userName,
    setUserName,
    error
}: {
    handleJoin: () => void,
    handleCreate: () => void,
    mode: 'join' | 'create',
    roomCode: string,
    setRoomCode: (code: string) => void,
    userName: string,
    setUserName: (name: string) => void,
    error: boolean,
}) {
    const canJoin = mode === 'join' && roomCode.trim() !== '' && userName.trim() !== '';
    const canCreate = mode === 'create' && userName.trim() !== '';

    return <>
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Name</label>
                <Input
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                   
                    className="bg-input border-border"
                />
            </div>
            {mode === 'join' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Room Code</label>
                    <Input
                        placeholder="Enter room code (e.g. MUSIC2024)"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toLowerCase())}
                        // onKeyDown={(e) => e.key === 'Enter' && canJoin && handleJoin()}
                        className="bg-input border-border"
                    />
                </div>
            )}


            {error && <p className="text-sm text-red-500">Room does not exist. Please check the code and try again.</p>}

            {mode === 'join' ? (
                <Button onClick={handleJoin} className="w-full" disabled={!canJoin}>
                    Join Room
                </Button>
            ) : (
                <Button onClick={handleCreate} className="w-full" disabled={!canCreate}>
                    Create Room
                </Button>
            )}
        </div>
    </>
}