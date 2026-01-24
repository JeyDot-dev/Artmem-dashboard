import { useEffect, useState } from 'react';
import { X, Heart, Loader2, ExternalLink } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PixivIllustration } from '../../../../shared/types';
import * as api from '../../lib/api';

interface PixivLightboxProps {
  illustration: PixivIllustration;
  onClose: () => void;
}

export function PixivLightbox({ illustration, onClose }: PixivLightboxProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const queryClient = useQueryClient();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Bookmark mutation with optimistic update
  const bookmarkMutation = useMutation({
    mutationFn: async (illustId: number) => {
      const currentState = illustration.isBookmarked;
      if (currentState) {
        return api.unbookmarkPixivIllust(illustId);
      } else {
        return api.bookmarkPixivIllust(illustId);
      }
    },
    onMutate: async (illustId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pixiv', 'daily-ranking'] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<{ illustrations: PixivIllustration[] }>(['pixiv', 'daily-ranking']);

      // Optimistically update
      queryClient.setQueryData<{ illustrations: PixivIllustration[] }>(
        ['pixiv', 'daily-ranking'],
        (old) => {
          if (!old) return old;
          return {
            illustrations: old.illustrations.map((illust) =>
              illust.id === illustId
                ? { ...illust, isBookmarked: !illust.isBookmarked }
                : illust
            ),
          };
        }
      );

      return { previousData };
    },
    onError: (err, illustId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['pixiv', 'daily-ranking'], context.previousData);
      }
      console.error('Failed to toggle bookmark:', err);
    },
  });

  const handleBookmarkToggle = () => {
    bookmarkMutation.mutate(illustration.id);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Use original for full resolution - same as dashboard for instant caching
  const imageUrl = api.getPixivImageUrl(illustration.imageUrls.original);
  const pixivUrl = `https://www.pixiv.net/artworks/${illustration.id}`;
  
  console.log('[PixivLightbox] Opening image URL:', imageUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-6xl max-h-[90vh] mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image container */}
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={illustration.title}
            className={`max-w-full max-h-[80vh] object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg truncate">
                  {illustration.title}
                </h3>
                <p className="text-white/70 text-sm truncate">
                  by {illustration.user.name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Bookmark button */}
                <button
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkMutation.isPending}
                  className={`p-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white ${
                    illustration.isBookmarked
                      ? 'bg-destructive hover:bg-destructive/90'
                      : 'bg-white/20 hover:bg-white/30'
                  } ${bookmarkMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={illustration.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  {bookmarkMutation.isPending ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Heart
                      className={`h-5 w-5 ${
                        illustration.isBookmarked
                          ? 'fill-white text-white'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>

                {/* View on Pixiv */}
                <a
                  href={pixivUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="View on Pixiv"
                >
                  <ExternalLink className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
