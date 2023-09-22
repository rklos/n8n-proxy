import type { Request } from 'express';
import axios from 'axios';

export function fetchWebhook(url: string, req: Request) {
  return axios({
    url,
    params: req.query,
    headers: {
      Accept: req.headers.Accept,
      'user-agent': req.headers['user-agent'],
      'accept-encoding': req.headers['accept-encoding'],
      'Content-Type': req.headers['Content-Type'],
    },
    method: req.method,
    data: req.body,
    // It allows to continue even if the response is not 200
    validateStatus: () => true,
  }).catch(() => {});
}
