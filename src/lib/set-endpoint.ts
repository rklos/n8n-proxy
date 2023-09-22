import type { Router, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import type { ConfigItem } from './types';
import { cache } from '../middlewares/cache';
import { getProxy } from './get-proxy';

export function setEndpoint(app: Router, config: ConfigItem) {
  const handlers: RequestHandler[] = [];

  const proxy = getProxy(config);
  handlers.push(proxy);

  if (config.cache) {
    handlers.unshift(cache(config.cache));
  }

  if (config.rateLimited) {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      legacyHeaders: false,
    });
    handlers.unshift(limiter);
  }

  app.all(`/${config.proxyPath}`, ...handlers);
}
