import { config } from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import fetch from 'node-fetch';
import proxyConfig from './config.example';

config();

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  legacyHeaders: false,
});

app.set('trust proxy', process.env.TRUST_PROXIES || false);
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const endpoint = process.env.ENDPOINT_PATH || '/';

app.get('/test-ip', (req, res) => {
  res.status(200)
    .send(req.ip);
});

app.all(`${endpoint}:path`, async (req, res) => {
  const proxyPath = req.params.path;
  const config = proxyConfig.find((item) => item.proxyPath === proxyPath);
  if (!config || config.method.toLowerCase() !== req.method.toLowerCase()) {
    res.status(404)
      .send();
    return;
  }

  const url = `${process.env.N8N_URL}/webhook${config.test ? '-test' : ''}/${config.webhookPath}`;
  const response = await fetch(url, { method: req.method });
  if (response.status !== 200) {
    res.status(500)
      .send('Internal Server Error');
    return;
  }

  if (config.returnResponse) {
    const data = await response.json();
    res.status(200)
      .send(data);
    return;
  }

  res.status(200)
    .send('OK');
});

app.listen(3000, () => console.log('Listening on port 3000!'));
