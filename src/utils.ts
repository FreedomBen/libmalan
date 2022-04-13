import MalanConfig from "./config";

interface BaseResp {
  data: any;
  body: any;
  header: any;
  headers: any;
  status: number;
  statusCode: number;
  ok: boolean;
  error: boolean;
  forbidden: boolean;
  unauthorized: boolean;
}

interface ErrorResponse {
  error: {
    ok: boolean;
    code: 400 | 401 | 403 | 404 | 422 | 423 | 429 | 461 | 462 | 500;
    message?: string;
    detail:
      | "Bad Request"
      | "Unauthorized"
      | "Forbidden"
      | "Not Found"
      | "Unprocessable Entity"
      | "Locked"
      | "Too Many Requests"
      | "Terms of Service Required"
      | "Privacy Policy Required"
      | "Internal Server Error";
  };
}

function fullUrl(config: MalanConfig, path: string): string {
  return config.host.toLowerCase().match(/^https?:\/\//)
    ? `${config.host}${path}`
    : `http://${config.host}${path}`;
}

export {
  BaseResp,
  ErrorResponse,
  fullUrl,
}
