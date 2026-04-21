import { useState } from 'react';
import SearchResults from './search-results';
import type { Track } from '@/lib/types';

interface SearchBarProps {
  allTracks: Track[];
  onSelectTrack: (track: Track) => void;
}

export default function SearchBar({ allTracks, onSelectTrack }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredResults = searchQuery.trim()
    ? allTracks.filter((track) =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectTrack = (track: Track) => {
    onSelectTrack(track);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => searchQuery && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 100)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted/60 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchQuery.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/40 rounded-lg shadow-lg z-50 p-4">
          <SearchResults results={filteredResults} onSelectTrack={handleSelectTrack} />
        </div>
      )}
    </div>
  );
}
