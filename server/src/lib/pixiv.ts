import PixivApi from 'pixiv-api-client';
import type { PixivIllustration } from '../../../shared/types';

const pixiv = new PixivApi();
let isInitialized = false;

/**
 * Initialize Pixiv client with refresh token from environment
 */
export async function initPixivClient(): Promise<void> {
  if (isInitialized) return;

  const refreshToken = process.env.PIXIV_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error('PIXIV_REFRESH_TOKEN not configured in environment variables');
  }

  try {
    await pixiv.refreshAccessToken(refreshToken);
    isInitialized = true;
    console.log('[Pixiv] Client initialized successfully');
  } catch (error) {
    console.error('[Pixiv] Failed to initialize:', error);
    throw new Error('Failed to authenticate with Pixiv API');
  }
}

/**
 * Get top N illustrations from daily ranking
 */
export async function getDailyRanking(limit = 15): Promise<PixivIllustration[]> {
  if (!isInitialized) {
    await initPixivClient();
  }

  try {
    const response = await pixiv.illustRanking({ mode: 'day' });
    
    // Map API response to our type
    const illustrations: PixivIllustration[] = response.illusts.slice(0, limit).map((illust: any) => ({
      id: illust.id,
      title: illust.title,
      type: illust.type,
      imageUrls: {
        squareMedium: illust.image_urls.square_medium,
        medium: illust.image_urls.medium,
        large: illust.image_urls.large,
        original: illust.meta_single_page?.original_image_url || illust.image_urls.large, // Fallback to large if no original
      },
      caption: illust.caption,
      user: {
        id: illust.user.id,
        name: illust.user.name,
        account: illust.user.account,
        profileImageUrls: {
          medium: illust.user.profile_image_urls.medium,
        },
      },
      tags: illust.tags.map((tag: any) => ({ name: tag.name })),
      width: illust.width,
      height: illust.height,
      isBookmarked: illust.is_bookmarked,
    }));

    return illustrations;
  } catch (error) {
    console.error('[Pixiv] Failed to fetch daily ranking:', error);
    throw new Error('Failed to fetch Pixiv daily ranking');
  }
}

/**
 * Bookmark an illustration
 */
export async function bookmarkIllust(illustId: number): Promise<void> {
  if (!isInitialized) {
    await initPixivClient();
  }

  try {
    await pixiv.bookmarkIllust(illustId);
    console.log(`[Pixiv] Bookmarked illustration ${illustId}`);
  } catch (error) {
    console.error(`[Pixiv] Failed to bookmark illustration ${illustId}:`, error);
    throw new Error('Failed to bookmark illustration');
  }
}

/**
 * Remove bookmark from an illustration
 */
export async function unbookmarkIllust(illustId: number): Promise<void> {
  if (!isInitialized) {
    await initPixivClient();
  }

  try {
    await pixiv.unbookmarkIllust(illustId);
    console.log(`[Pixiv] Unbookmarked illustration ${illustId}`);
  } catch (error) {
    console.error(`[Pixiv] Failed to unbookmark illustration ${illustId}:`, error);
    throw new Error('Failed to unbookmark illustration');
  }
}

/**
 * Check if Pixiv client is configured
 */
export function isPixivConfigured(): boolean {
  return !!process.env.PIXIV_REFRESH_TOKEN;
}
