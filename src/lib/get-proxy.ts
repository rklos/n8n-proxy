import type { Request, Response, RequestHandler } from 'express';
import type { ConfigItem } from './types';
import { fetchWebhook } from './fetch-webhook';

export function getProxy(config: ConfigItem): RequestHandler {
  const n8nUrl = process.env.N8N_URL!.replace(/\/$/, '');

  return async (req: Request, res: Response) => {
    if (config.method.toLowerCase() !== req.method.toLowerCase()) {
      res.status(404)
        .send();
      return;
    }

    const url = `${n8nUrl}/webhook/${config.webhookPath}`;
    const response = await fetchWebhook(url, req);

    if (response?.status !== 200) {
      res.status(500)
        .send('Internal Server Error');
      return;
    }

    if (config.returnResponse) {
      res.status(200)
        .header('Content-Type', response.headers['content-type'])
        .send(response.data);
      return;
    }

    res.status(200)
      .send('OK');
  };
}
