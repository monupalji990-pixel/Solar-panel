import type { Request, Response, NextFunction } from 'express';
import { cacheKeyFromReq, getCache, setCache } from '../utils/redisCache';

export type CacheTTL = { ttlSeconds: number };

export const cached = (ttlSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache successful GETs
    if (req.method !== 'GET') return next();

    try {
      const key = cacheKeyFromReq(req);
      const cachedValue = await getCache<any>(key);
      if (cachedValue) {
        return res.send(cachedValue);
      }

      // Capture res.send payload
      const originalSend = res.send.bind(res);
      (res as any).send = (body: any) => {
        // set cache for 2xx responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          void setCache(key, body, ttlSeconds);
        }
        return originalSend(body);
      };

      return next();
    } catch (e) {
      return next();
    }
  };
};

export const cachedTTL = (opts: CacheTTL) => cached(opts.ttlSeconds);

