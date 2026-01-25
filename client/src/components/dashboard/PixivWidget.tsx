import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';
import type { PixivIllustration } from '../../../../shared/types';
import * as api from '../../lib/api';
import { PixivLightbox } from './PixivLightbox';

export function PixivWidget() {
  const [selectedIllust, setSelectedIllust] = useState<PixivIllustration | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndices, setPreviousIndices] = useState<number[]>([]);

  // Get today's date string (YYYY-MM-DD) for cache invalidation
  const today = new Date().toISOString().split('T')[0];

  // Fetch Pixiv daily ranking - refetch daily by including date in query key
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pixiv', 'daily-ranking', today], // Date in key ensures daily refresh
    queryFn: api.getPixivDailyRanking,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - data is fresh for half a day
    gcTime: 1000 * 60 * 60 * 24 * 2, // Keep cache for 2 days
    refetchOnMount: true, // Refetch when component mounts (if stale)
    refetchOnWindowFocus: false, // Don't refetch on window focus to avoid unnecessary requests
    refetchOnReconnect: true, // Refetch if connection was lost and regained
  });

  const illustrations = data?.illustrations || [];

  // Pick a new random illustration on mount (but not on first load)
  useEffect(() => {
    if (illustrations.length > 0 && currentIndex === 0 && previousIndices.length === 0) {
      // First load - pick random starting image
      const randomIndex = Math.floor(Math.random() * illustrations.length);
      setCurrentIndex(randomIndex);
      setPreviousIndices([randomIndex]);
    }
  }, [illustrations.length]); // Only run when illustrations load

  // Function to get next random index
  const getNextRandomIndex = () => {
    if (illustrations.length === 0) return 0;

    // If we've shown all images, reset history but keep current
    if (previousIndices.length >= illustrations.length) {
      const newIndex = Math.floor(Math.random() * illustrations.length);
      setPreviousIndices([newIndex]);
      return newIndex;
    }

    // Pick from unseen images
    const availableIndices = Array.from({ length: illustrations.length }, (_, i) => i).filter(
      (i) => !previousIndices.includes(i)
    );

    if (availableIndices.length === 0) {
      // Fallback - should not happen
      return 0;
    }

    const newIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setPreviousIndices([...previousIndices, newIndex]);
    return newIndex;
  };

  const handleNextImage = () => {
    const nextIndex = getNextRandomIndex();
    setCurrentIndex(nextIndex);
  };

  const handleRefresh = () => {
    refetch();
    setPreviousIndices([]);
    setCurrentIndex(0);
  };

  if (error) {
    return (
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Pixiv Inspiration
          </h3>
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load Pixiv illustrations'}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Make sure PIXIV_REFRESH_TOKEN is configured in server/.env
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Pixiv Inspiration
          </h3>
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!illustrations.length) {
    return (
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Pixiv Inspiration
          </h3>
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">No illustrations available</div>
      </div>
    );
  }

  const currentIllust = illustrations[currentIndex];
  // Use original for both dashboard and lightbox - cached once, opens instantly
  const imageUrl = api.getPixivImageUrl(currentIllust.imageUrls.original);
  
  console.log('[PixivWidget] Current image URL:', imageUrl);

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-card group h-[300px] flex flex-col">
        <div className="p-3 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Pixiv Inspiration
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNextImage}
              className="p-1 hover:bg-primary/10 rounded transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              title="Next image"
            >
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        <button
          onClick={() => setSelectedIllust(currentIllust)}
          className="w-full flex-1 flex flex-col min-h-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        >
          <div className="relative flex-1 overflow-hidden bg-muted/20 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={currentIllust.title}
              className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          <div className="p-3 text-left flex-shrink-0">
            <p className="text-sm font-medium truncate">{currentIllust.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              by {currentIllust.user.name}
            </p>
          </div>
        </button>
      </div>

      {selectedIllust && (
        <PixivLightbox
          illustration={selectedIllust}
          onClose={() => setSelectedIllust(null)}
        />
      )}
    </>
  );
}
