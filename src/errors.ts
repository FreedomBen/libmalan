export class MalanError extends Error {
  code: ErrorBody["code"];
  detail: ErrorBody["detail"];
  token_expired?: ErrorBody["token_expired"];
  errors?: ErrorBody["errors"];

  constructor(data: ErrorBody) {
    super(data.message);
    this.code = data.code;
    this.detail = data.detail;
    this.token_expired = data.token_expired;
    this.errors = data.errors;
  }
}

type DataBody<T = unknown> = {
  data: T;
};

type ErrorBody = {
  ok: false;
  code: 400 | 401 | 403 | 404 | 422 | 423 | 429 | 461 | 462 | 500;
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
  message: string;
  token_expired?: true;
  errors?: Record<string, string[]>;
};

type Response = {
  response: {
    body: DataBody | ErrorBody;
  };
};

function isResponse(e: unknown): e is Response {
  return typeof e === "object" && !!e["response"];
}

function isErrorBody(b: Response["response"]["body"]): b is ErrorBody {
  return b["ok"] === false;
}

export function handleResponseError(e: unknown): void {
  if (isResponse(e) && isErrorBody(e.response.body)) {
    throw new MalanError(e.response.body);
  }
  throw e;
}
