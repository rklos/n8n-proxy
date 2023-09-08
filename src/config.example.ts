interface ConfigItem {
  webhookPath: string;
  proxyPath: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  test?: boolean;
  returnResponse?: boolean;
}

export const config: ConfigItem[] = [];

export default config;
