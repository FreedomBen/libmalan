export class MalanError extends Error {
  detail: string;

  constructor(data: { detail: string; message: string }) {
    super(data.message);
    this.detail = data.detail;
  }
}

type ManualError = { detail: string; message: string };
type ValidationError = Record<string, string>;

type Response = {
  response: {
    body: {
      errors?: ManualError | ValidationError;
    };
  };
};

function isResponse(e: unknown): e is Response {
  return typeof e === "object" && !!e["response"];
}

function isManualError(e: ManualError | ValidationError): e is ManualError {
  return !!e["detail"] && !!e["message"];
}

export function handleResponseError(e: unknown): void {
  if (isResponse(e) && e.response.body.errors) {
    throw new MalanError(
      isManualError(e.response.body.errors)
        ? e.response.body.errors
        : {
            detail: "invalid",
            message: Object.entries(e.response.body.errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", "),
          }
    );
  }
  throw e;
}
