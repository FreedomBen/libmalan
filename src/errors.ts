export class MalanError extends Error {
  detail: string;

  constructor(data: { detail: string; message: string }) {
    super(data.message);
    this.detail = data.detail;
  }
}

type Response = {
  response: {
    body: {
      ok: boolean;
      code: 400 | 401 | 403 | 404 | 422 | 423 | 429 | 461 | 462 | 500;
      message: string;
      errors?: Record<string, string[]>;
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
  };
};

function isResponse(e: unknown): e is Response {
  return typeof e === "object" && !!e["response"];
}

export function handleResponseError(e: unknown): void {
  if (isResponse(e) && e.response.body && !e.response.body.ok) {
    throw new MalanError(e.response.body);
  }
  throw e;
}
