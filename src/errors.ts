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
      errors?: {
        detail: string;
        message: string;
      };
    };
  };
};

function isResponse(e: unknown): e is Response {
  return typeof e === "object" && !!e["response"];
}

export function handleResponseError(e: unknown): void {
  if (isResponse(e) && e.response.body.errors) {
    throw new MalanError(e.response.body.errors);
  }
  throw e;
}
