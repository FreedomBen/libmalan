const superagent = require('superagent');

import { fullUrl, BaseResp } from './utils';

import MalanConfig from './config';
import { handleResponseError } from './errors';

type BaseSessionResponse = {
  api_token: string,
  authenticated_at: string,
  expires_at: string,
  id: string,
  ip_address: string,
  location: string,
  revoked_at: string,
  user_id: string,
  is_valid: boolean,
  extendable_until: string,
  max_extension_secs: number,
}

type LoginResponse = BaseResp & BaseSessionResponse
type LogoutResponse = BaseResp & BaseSessionResponse
type ExtendResponse = BaseResp & BaseSessionResponse
type IsValidResponse = boolean
type IsValidWithRoleResponse = boolean
type SessionResponse = BaseResp & BaseSessionResponse

function login(c: MalanConfig, username: string, password: string, expirationSeconds = 0, maxExtensionSeconds = 0, extendableUntilSeconds = 0): Promise<LoginResponse> {
  return superagent
    .post(fullUrl(c, "/api/sessions"))
    .send({
      session: {
        username,
        password,
        never_expires: expirationSeconds === 0,
        expires_in_seconds: expirationSeconds === 0 ? undefined : expirationSeconds,
        max_extension_secs:  maxExtensionSeconds === 0 ? undefined : maxExtensionSeconds,
        extendable_until_seconds: extendableUntilSeconds === 0 ? undefined : extendableUntilSeconds
      }
    })
    .then(resp => ({ ...resp, data: resp.body.data, ...resp.body.data }))
    .catch(handleResponseError)
}

function logout(c: MalanConfig, user_id: string, session_id: string) {
  return superagent
    .del(fullUrl(c, `/api/users/${user_id}/sessions/${session_id}`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: resp.body.data, ...resp.body.data }))
    .catch(handleResponseError)
}

function extend(c: MalanConfig, expireInSeconds = 0): Promise<ExtendResponse> {
  return superagent
    .put(fullUrl(c, "/api/sessions/current/extend"))
    .set('Authorization', `Bearer ${c.api_token}`)
    .send({expire_in_seconds: expireInSeconds === 0 ? undefined : expireInSeconds})
    .then(resp => ({ ...resp, data: resp.body.data, ...resp.body.data }))
    .catch(handleResponseError)
}

function logoutCurrent(c: MalanConfig) {
  return superagent
    .del(fullUrl(c, `/api/sessions/current`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: resp.body.data, ...resp.body.data }))
    .catch(handleResponseError);
}

function getSession(c: MalanConfig, user_id: string, session_id: string) {
  return superagent
    .get(fullUrl(c, `/api/users/${user_id}/sessions/${session_id}`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: resp.body.data, ...resp.body.data }))
    .catch(handleResponseError)
}

function isValid(c: MalanConfig, user_id: string, session_id: string) {
  return getSession(c, user_id, session_id)
    .then(resp => resp.data.is_valid)
}

function isValidWithRole(c: MalanConfig, user_id: string, session_id: string, role: string) {
  return superagent
    .get(fullUrl(c, `/api/users/${user_id}/sessions/${session_id}/roles/${role}`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: resp.body.data, ...resp.body.data }))
    .then(resp => resp.data.is_valid)
    .catch(handleResponseError)
}

export {
  login,
  LoginResponse,
  logout,
  logoutCurrent,
  extend,
  ExtendResponse,
  LogoutResponse,
  isValid,
  IsValidResponse,
  isValidWithRole,
  IsValidWithRoleResponse,
  getSession,
  SessionResponse,
}
