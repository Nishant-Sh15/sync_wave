export default function ButtonSection({  mode, onModeChange, userName }: {
    mode: 'join' | 'create',
    onModeChange: (mode: 'join' | 'create') => void,
    userName: string
}) {
   

    return <>
        <div className="flex gap-2 rounded-lg bg-muted p-1">
            <button
                onClick={() => onModeChange('join')}
                className={`flex-1 py-2 px-4 rounded font-medium transition-all ${
                    mode === 'join'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                Join Room
            </button>
            <button
                onClick={() => {
                    onModeChange('create');
                   
                }}
                className={`flex-1 py-2 px-4 rounded font-medium transition-all  ${
                    mode === 'create'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                Create Room
            </button>
        </div>
    </>
}