import axios from 'axios';
import { config } from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import proxyConfig from './config';

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

app.get('/test-ip', (req, res) => {
  res.status(200)
    .send(req.ip);
});

const endpoint = (process.env.ENDPOINT_PATH || '')
  .replace(/\/$/, '')
  .replace(/^\//, '');

app.all(`/${endpoint}/:path`, async (req, res) => {
  const proxyPath = req.params.path;
  const config = proxyConfig.find((item) => item.proxyPath === proxyPath);
  if (!config || config.method.toLowerCase() !== req.method.toLowerCase()) {
    res.status(404)
      .send();
    return;
  }

  const n8nUrl = process.env.N8N_URL!.replace(/\/$/, '');

  const url = `${n8nUrl}/webhook${config.test ? '-test' : ''}/${config.webhookPath}`;
  const response = await axios({
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
    validateStatus: () => true,
  });

  if (response.status !== 200) {
    res.status(500)
      .send('Internal Server Error');
    return;
  }

  if (config.returnResponse) {
    res.status(200)
      .send(response.data);
    return;
  }

  res.status(200)
    .send('OK');
});

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`));
