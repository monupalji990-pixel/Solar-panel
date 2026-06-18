import type { Request, Response, NextFunction } from 'express';

export const logQueryTime = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime.bigint();

    const originalSend = res.send.bind(res);
    (res as any).send = (body: any) => {
      const end = process.hrtime.bigint();
      if (process.env.NODE_ENV === 'development') {
        const ms = Number(end - start) / 1_000_000;
        // Keep it lightweight
        // eslint-disable-next-line no-console
        console.log(`[query-time] ${req.originalUrl} -> ${ms.toFixed(2)}ms`);
      }
      return originalSend(body);
    };

    return next();
  };
};

