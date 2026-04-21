'use client';

import { Button } from '@/components/ui/button';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function PlaybackControls({
  isPlaying,
  onTogglePlayback,
  onPrevious,
  onNext,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-6">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        className="h-10 w-10 rounded-full border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
        </svg>
      </Button>

      {/* Play/Pause Button */}
      <Button
        onClick={onTogglePlayback}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
        size="icon"
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </Button>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        className="h-10 w-10 rounded-full border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z" />
        </svg>
      </Button>
    </div>
  );
}
