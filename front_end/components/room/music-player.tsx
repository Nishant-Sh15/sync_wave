'use client';

import { useState, useEffect } from 'react';
import { Track } from '@/lib/types';
import PlaybackControls from './playback-controls';
import FileUpload from './upload-box';
import Image from 'next/image';

interface MusicPlayerProps {
  track: Track | undefined;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onTogglePlayback: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeChange: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onSelectTrack?: (track: Track) => void;
}

export default function MusicPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  onTogglePlayback,
  onPrevious,
  onNext,
  onTimeChange,
  onVolumeChange,
  onSelectTrack,
}: MusicPlayerProps) {
  const [mounted, setMounted] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle audio playback
  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play().catch(console.error);
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement]);

  // Handle volume changes
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume / 100;
    }
  }, [volume, audioElement]);

  // Handle time changes
  useEffect(() => {
    if (audioElement && Math.abs(audioElement.currentTime - currentTime) > 1) {
      audioElement.currentTime = currentTime;
    }
  }, [currentTime, audioElement]);

  const handleAudioLoad = (audio: HTMLAudioElement | null) => {
    if (audio) {
      setAudioElement(audio);
      // Update duration when audio loads
      audio.addEventListener('loadedmetadata', () => {
        console.log('Audio duration:', audio.duration);
      });
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 overflow-y-auto">
      {/* File Upload */}
      <div className="w-full max-w-sm">
        <FileUpload onFileSelect={onSelectTrack || (() => {})} />
      </div>

      {!track ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Upload an audio file to get started</p>
          </div>
        </div>
      ) : (
        <>
          {/* Album Art */}
          <div className="relative w-full max-w-xs aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl"></div>
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted border border-border/30 shadow-2xl">
              {track.albumArt ? (
                <Image
                  src={track.albumArt}
                  alt={track.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                  <span className="text-6xl">♪</span>
                </div>
              )}
              {/* Playing indicator */}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/10 animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center max-w-sm mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-foreground text-balance">{track.title}</h2>
            <p className="text-muted-foreground">{track.artist}</p>
            <p className="text-xs text-muted-foreground/60">{track.album}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-sm space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => onTimeChange(Number(e.target.value))}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              style={{
                backgroundImage: `linear-gradient(to right, hsl(var(--color-primary)) 0%, hsl(var(--color-primary)) ${(currentTime / (duration || 1)) * 100}%, hsl(var(--color-muted)) ${(currentTime / (duration || 1)) * 100}%, hsl(var(--color-muted)) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <PlaybackControls
            isPlaying={isPlaying}
            onTogglePlayback={onTogglePlayback}
            onPrevious={onPrevious}
            onNext={onNext}
          />

          {/* Volume Control */}
          <div className="w-full max-w-sm flex items-center gap-3">
            <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              style={{
                backgroundImage: `linear-gradient(to right, hsl(var(--color-primary)) 0%, hsl(var(--color-primary)) ${volume}%, hsl(var(--color-muted)) ${volume}%, hsl(var(--color-muted)) 100%)`,
              }}
            />
            <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
          </div>

          {/* Hidden Audio Element */}
          {track?.fileUrl && (
            <audio
              ref={handleAudioLoad}
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${track.fileUrl}`}
              preload="metadata"
              onTimeUpdate={(e) => {
                const audio = e.target as HTMLAudioElement;
                onTimeChange(audio.currentTime);
              }}
              onLoadedMetadata={(e) => {
                const audio = e.target as HTMLAudioElement;
                // Update duration in parent component
                console.log('Duration loaded:', audio.duration);
              }}
              onEnded={() => {
                onNext();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
