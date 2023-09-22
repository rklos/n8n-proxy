import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';

import proxyConfig from './config/config';
import { setEndpoint } from './lib/set-endpoint';
import { getEndpointPrefix } from './lib/get-endpoint-prefix';

config();

const endpoint = getEndpointPrefix();
const app = express();
const router = express.Router();

app.set('trust proxy', process.env.TRUST_PROXIES || false);
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(endpoint, router);
app.get('/test-ip', (req, res) => {
  res.status(200)
    .send(req.ip);
});

proxyConfig.forEach((configItem) => setEndpoint(router, configItem));

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`));
