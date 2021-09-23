import MalanConfig from '../src/config';

export const base = {
  host: "0.0.0.0:4000",
  api_token: "",
}

export const forSession =
  (session) => ({ ...base, api_token: session.api_token })

