export interface ConfigItem {
  webhookPath: string;
  proxyPath: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  returnResponse?: boolean;
  rateLimited?: boolean;
  cache?: number;
}
