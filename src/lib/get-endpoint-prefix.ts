export function getEndpointPrefix() {
  let endpoint = (process.env.ENDPOINT_PREFIX || '')
    .replace(/\/$/, '')
    .replace(/^\//, '');
  if (endpoint) endpoint = `/${endpoint}`;
  return endpoint;
}
