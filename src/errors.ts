export class MalanError extends Error {
  code: ErrorBody["code"];
  detail: ErrorBody["detail"];
  token_expired?: ErrorBody["token_expired"];
  mfa_required?: ErrorBody["mfa_required"];
  mfa_types?: ErrorBody["mfa_types"];
  invalid_mfa_code?: ErrorBody["invalid_mfa_code"];
  errors?: ErrorBody["errors"];
  // Error has a message property so this needs a different name to avoid collision
  messageStr?: ErrorBody["message"];

  constructor(data: ErrorBody) {
    super(data.message);
    this.code = data.code;
    this.detail = data.detail;
    this.token_expired = data.token_expired;
    this.mfa_required = data.mfa_required;
    this.mfa_types = data.mfa_types;
    this.invalid_mfa_code = data.invalid_mfa_code;
    this.errors = data.errors;
    this.messageStr = data.message;
  }
}

type DataBody<T = unknown> = {
  data: T;
};

type ErrorBody = {
  ok: false;
  code: 400 | 401 | 403 | 404 | 409 | 422 | 423 | 429 | 461 | 462 | 500;
  detail:
    | "Bad Request"
    | "Unauthorized"
    | "Forbidden"
    | "Not Found"
    | "Conflict"
    | "Unprocessable Entity"
    | "Locked"
    | "Too Many Requests"
    | "Terms of Service Required"
    | "Privacy Policy Required"
    | "Internal Server Error";
  message: string;
  token_expired?: true;
  // MFA is enabled and the login (or TOTP endpoint) needs a valid totp_code;
  // invalid_mfa_code additionally means the supplied code was rejected
  mfa_required?: true;
  mfa_types?: string[];
  invalid_mfa_code?: true;
  // Validation errors are a map of field -> messages; flag-style errors
  // (token_expired, mfa_required, ...) use a list of such maps
  errors?: Record<string, string[]> | Array<Record<string, string[]>>;
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
