interface ConfigItem {
  webhookPath: string;
  proxyPath: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  test?: boolean;
  returnResponse?: boolean;
}

export const configExample: ConfigItem[] = [];

export default configExample;
