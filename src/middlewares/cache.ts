import type { NextFunction, Request, Response } from 'express';
import mcache from 'memory-cache';

export const cache = (durationInSeconds: number) => (req: Request, res: Response, next: NextFunction) => {
  const key = `_express _${req.originalUrl}` || req.url;
  const cachedBody = mcache.get(key);
  if (cachedBody) {
    res.send(cachedBody);
    return;
  }

  const originalResponse = res.send.bind(res);
  res.send = (body) => {
    mcache.put(key, body, durationInSeconds * 1000);
    originalResponse(body);
    return res;
  };

  next();
};
