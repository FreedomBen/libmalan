const superagent = require('superagent');

import { fullUrl, BaseResp } from './utils';

import MalanConfig from './config';

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
}

type LoginResponse = BaseResp & BaseSessionResponse
type LogoutResponse = BaseResp & BaseSessionResponse
type IsValidResponse = boolean
type IsValidWithRoleResponse = boolean
type SessionResponse = BaseResp & BaseSessionResponse

function login(c: MalanConfig, username: string, password: string): Promise<LoginResponse> {
  return superagent
    .post(fullUrl(c, "/api/sessions"))
    .send({session: {username, password}})
    .then(resp => ({ ...resp, data: resp.body.data, ...resp.body.data }))
}

function logout(c: MalanConfig, user_id: string, session_id: string) {
  return superagent
    .del(fullUrl(c, `/api/users/${user_id}/sessions/${session_id}`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: resp.body.data, ...resp.body.data }))
}

function getSession(c: MalanConfig, user_id: string, session_id: string) {
  return superagent
    .get(fullUrl(c, `/api/users/${user_id}/sessions/${session_id}`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: resp.body.data, ...resp.body.data }))
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
}

export {
  login,
  LoginResponse,
  logout,
  LogoutResponse,
  isValid,
  IsValidResponse,
  isValidWithRole,
  IsValidWithRoleResponse,
  getSession,
  SessionResponse,
}
