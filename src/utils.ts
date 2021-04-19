import MalanConfig from './config';

interface BaseResp {
  data: any
  body: any,
  header: any,
  headers: any,
  status: number,
  statusCode: number,
  ok: boolean,
  error: boolean,
  forbidden: boolean,
  unauthorized: boolean,
}

function fullUrl(config: MalanConfig, path: string): string {
  return `http://${config.host}${path}`
}

export {
  BaseResp,
  fullUrl,
}
