const superagent = require('superagent');

import { fullUrl, BaseResp } from './utils';

import MalanConfig from './config';

type BaseUserResp = {
  id:  string,
  birthday: string,
  email: string,
  email_verified: boolean,
  ethnicity: string,
  first_name: string,
  gender: string,
  height: number,
  race: Array<String>,
  last_name: string,
  nick_name: string,
  password: string,
  preferences: { theme: string },
  privacy_policy_accept_events: Array<string>,
  roles: Array<string>,
  sex: string,
  tos_accept_events: Array<string>,
  username: string,
  weight: number,
  latest_tos_accept_ver: number,
  latest_pp_accept_ver: number,
  tos_accepted: boolean,
  privacy_policy_accepted: boolean,
  custom_attrs: object,
}

type UserResponse = BaseResp & BaseUserResp

type WhoamiResponse = BaseResp & {
  user_id: string,
  user_roles: Array<string>,
  expires_at: string,
  terms_of_service: string,
  privacy_policy: string,
}

interface CreateUserParams {
  email: string,
  username: string,
  password: string,
  first_name: string,
  last_name: string,
}

interface UpdateUserParams {
  email?: string,
  username?: string,
  password?: string,
  first_name?: string,
  last_name?: string,
  nick_name?: string,
  sex?: string,
  gender?: string,
  race?: Array<string>,
  ethnicity?: string,
  birthday?: string,
  weight?: number,
  height?: number,
  roles?: Array<string>,
  custom_attrs?: object,
}

function createUser(c: MalanConfig, params: CreateUserParams): Promise<UserResponse> {
  return superagent
    .post(fullUrl(c, "/api/users"))
    .send({user: params})
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    //.catch(err => ({ ...err, ok: false }))
}

function getUserByUsername(c: MalanConfig, username: string): Promise<UserResponse> {
  return superagent
    .get(fullUrl(c, `/api/users/${username}`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    //.catch(err => ({ ...err, ok: false }))
}

function getUser(c: MalanConfig, id: string): Promise<UserResponse> {
  return superagent
    .get(fullUrl(c, `/api/users/${id}`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    //.catch(err => ({ ...err, ok: false }))
}

function whoamiFull(c: MalanConfig): Promise<UserResponse> {
  return superagent
    .get(fullUrl(c, `/api/users/me`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    //.catch(err => ({ ...err, ok: false }))
}

function whoami(c: MalanConfig): Promise<WhoamiResponse> {
  return superagent
    .get(fullUrl(c, `/api/users/whoami`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    //.catch(err => ({ ...err, ok: false }))
}

function updateUser(c: MalanConfig, id: string, params: UpdateUserParams): Promise<UserResponse> {
  return superagent
    .put(fullUrl(c, `/api/users/${id}`))
    .send({user: params})
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    //.catch(err => ({ ...err, ok: false }))
}

function adminUpdateUser(c: MalanConfig, id: string, params: UpdateUserParams): Promise<UserResponse> {
  return superagent
    .put(fullUrl(c, `/api/admin/users/${id}`))
    .send({user: params})
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    //.catch(err => ({ ...err, ok: false }))
}

function acceptTos(c: MalanConfig, id: string, accept: boolean): Promise<UserResponse> {
  return superagent
    .put(fullUrl(c, `/api/users/${id}`))
    .send({user: {accept_tos: accept}})
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    //.catch(err => ({ ...err, ok: false }))
}

function acceptPrivacyPolicy(c: MalanConfig, id: string, accept: boolean): Promise<UserResponse> {
  return superagent
    .put(fullUrl(c, `/api/users/${id}`))
    .send({user: {accept_privacy_policy: accept}})
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    //.catch(err => ({ ...err, ok: false }))
}

export {
  UserResponse,
  WhoamiResponse,
  CreateUserParams,
  UpdateUserParams,
  getUser,
  getUserByUsername,
  whoami,
  whoamiFull,
  createUser,
  updateUser,
  acceptTos,
  acceptPrivacyPolicy,
}
