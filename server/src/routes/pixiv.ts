import { Router, Request, Response } from 'express';
import { getDailyRanking, bookmarkIllust, unbookmarkIllust, isPixivConfigured } from '../lib/pixiv';

const router = Router();

// In-memory cache for proxied images (URL -> Buffer)
const imageCache = new Map<string, { buffer: Buffer; contentType: string; cachedAt: number }>();
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_MAX_SIZE = 100; // Max 100 images cached

// Clean up old cache entries
function cleanupCache() {
  const now = Date.now();
  const entriesToDelete: string[] = [];
  
  for (const [url, cached] of imageCache.entries()) {
    if (now - cached.cachedAt > CACHE_MAX_AGE) {
      entriesToDelete.push(url);
    }
  }
  
  entriesToDelete.forEach(url => imageCache.delete(url));
  
  // If still too large, remove oldest entries
  if (imageCache.size > CACHE_MAX_SIZE) {
    const sorted = Array.from(imageCache.entries()).sort((a, b) => a[1].cachedAt - b[1].cachedAt);
    const toRemove = sorted.slice(0, imageCache.size - CACHE_MAX_SIZE);
    toRemove.forEach(([url]) => imageCache.delete(url));
  }
}

/**
 * GET /api/pixiv/daily-ranking
 * Fetch top 15 illustrations from daily ranking
 */
router.get('/pixiv/daily-ranking', async (req: Request, res: Response) => {
  if (!isPixivConfigured()) {
    return res.status(503).json({ 
      error: 'Pixiv integration not configured. Please set PIXIV_REFRESH_TOKEN in .env file.' 
    });
  }

  try {
    const illustrations = await getDailyRanking(15);
    res.json({ illustrations });
  } catch (error: any) {
    console.error('[Pixiv Route] Error fetching daily ranking:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch Pixiv daily ranking' });
  }
});

/**
 * POST /api/pixiv/bookmark/:illustId
 * Bookmark an illustration
 */
router.post('/pixiv/bookmark/:illustId', async (req: Request, res: Response) => {
  if (!isPixivConfigured()) {
    return res.status(503).json({ 
      error: 'Pixiv integration not configured' 
    });
  }

  const illustId = parseInt(req.params.illustId, 10);
  if (isNaN(illustId)) {
    return res.status(400).json({ error: 'Invalid illustration ID' });
  }

  try {
    await bookmarkIllust(illustId);
    res.json({ success: true });
  } catch (error: any) {
    console.error(`[Pixiv Route] Error bookmarking ${illustId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to bookmark illustration' });
  }
});

/**
 * DELETE /api/pixiv/bookmark/:illustId
 * Remove bookmark from an illustration
 */
router.delete('/pixiv/bookmark/:illustId', async (req: Request, res: Response) => {
  if (!isPixivConfigured()) {
    return res.status(503).json({ 
      error: 'Pixiv integration not configured' 
    });
  }

  const illustId = parseInt(req.params.illustId, 10);
  if (isNaN(illustId)) {
    return res.status(400).json({ error: 'Invalid illustration ID' });
  }

  try {
    await unbookmarkIllust(illustId);
    res.json({ success: true });
  } catch (error: any) {
    console.error(`[Pixiv Route] Error unbookmarking ${illustId}:`, error);
    res.status(500).json({ error: error.message || 'Failed to unbookmark illustration' });
  }
});

/**
 * GET /api/pixiv/image
 * Proxy Pixiv images with proper headers (Referer required)
 * Includes server-side caching for instant subsequent loads
 */
router.get('/pixiv/image', async (req: Request, res: Response) => {
  const imageUrl = req.query.url as string;
  
  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    // Check cache first
    const cached = imageCache.get(imageUrl);
    if (cached) {
      console.log('[Pixiv Proxy] Serving from cache:', imageUrl);
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.setHeader('X-Cache', 'HIT');
      return res.send(cached.buffer);
    }

    console.log('[Pixiv Proxy] Fetching from Pixiv:', imageUrl);
    const fetchStart = Date.now();
    
    const response = await fetch(imageUrl, {
      headers: {
        'Referer': 'https://www.pixiv.net/',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const fetchTime = Date.now() - fetchStart;
    console.log(`[Pixiv Proxy] Fetched in ${fetchTime}ms, size: ${(buffer.length / 1024).toFixed(1)}KB`);

    // Cache the image
    imageCache.set(imageUrl, {
      buffer,
      contentType,
      cachedAt: Date.now()
    });
    
    // Cleanup cache periodically
    if (imageCache.size > CACHE_MAX_SIZE) {
      cleanupCache();
    }

    // Send response
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-Cache', 'MISS');
    res.send(buffer);
  } catch (error: any) {
    console.error('[Pixiv Route] Error proxying image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

export default router;
