import type { Router, RequestHandler, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import apicache from 'apicache';
import type { ConfigItem } from './types';
import { getProxy } from './get-proxy';

const cache = apicache.middleware;
const onlyStatus200 = (req: Request, res: Response) => res.statusCode === 200;

export function setEndpoint(app: Router, config: ConfigItem) {
  const handlers: RequestHandler[] = [];

  const proxy = getProxy(config);
  handlers.push(proxy);

  if (config.cache) {
    handlers.unshift(cache(config.cache, onlyStatus200));
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
