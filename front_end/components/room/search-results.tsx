import Image from 'next/image';
import type { Track } from '@/lib/types';

interface SearchResultsProps {
  results: Track[];
  onSelectTrack: (track: Track) => void;
}

export default function SearchResults({ results, onSelectTrack }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No songs found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
      {results.map((track) => (
        <button
          key={track.id}
          onClick={() => onSelectTrack(track)}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/80 transition-colors group cursor-pointer"
        >
          {/* Album Thumbnail */}
          <div className="relative w-12 h-12 flex-shrink-0 rounded bg-muted overflow-hidden">
            {track.albumArt ? (
              <Image
                src={track.albumArt}
                alt={track.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/40 to-accent/40">
                <span className="text-sm">♪</span>
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {track.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {track.artist}
            </p>
          </div>

          {/* Duration */}
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
          </span>
        </button>
      ))}
    </div>
  );
}
