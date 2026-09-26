const superagent = require('superagent');

import { fullUrl, BaseResp } from './utils';

import MalanConfig from './config';
import { handleResponseError } from './errors';

type TotpStatus = {
  status: "none" | "pending" | "enabled",
  confirmed_at: string | null,
  backup_codes_remaining: number,
}

type TotpEnrollment = {
  secret_base32: string,
  otpauth_uri: string,
  qr_code_svg: string,
}

type TotpBackupCodes = {
  backup_codes: Array<string>,
}

type TotpStatusResponse = Omit<BaseResp, 'data'> & { data: TotpStatus }
type TotpEnrollmentResponse = Omit<BaseResp, 'data'> & { data: TotpEnrollment }
type TotpBackupCodesResponse = Omit<BaseResp, 'data'> & { data: TotpBackupCodes }

// user_id accepts a UUID, a username, or "current" on all non-admin functions

function getTotpStatus(c: MalanConfig, user_id: string): Promise<TotpStatusResponse> {
  return superagent
    .get(fullUrl(c, `/api/users/${user_id}/totp`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    .catch(handleResponseError)
}

// The secret, otpauth URI, and QR code are disclosed only by this call --
// show them to the user now, they cannot be retrieved again
function startTotpEnrollment(c: MalanConfig, user_id: string, password: string): Promise<TotpEnrollmentResponse> {
  return superagent
    .post(fullUrl(c, `/api/users/${user_id}/totp`))
    .send({ password })
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    .catch(handleResponseError)
}

// Returns single-use backup codes (shown only once). Enabling TOTP revokes
// every other active session for the user; the calling session stays valid.
function confirmTotpEnrollment(c: MalanConfig, user_id: string, code: string): Promise<TotpBackupCodesResponse> {
  return superagent
    .put(fullUrl(c, `/api/users/${user_id}/totp/confirm`))
    .send({ code })
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    .catch(handleResponseError)
}

// code accepts a 6-digit TOTP code or a 12-character backup code
function disableTotp(c: MalanConfig, user_id: string, password: string, code: string): Promise<TotpStatusResponse> {
  return superagent
    .post(fullUrl(c, `/api/users/${user_id}/totp/disable`))
    .send({ password, code })
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    .catch(handleResponseError)
}

// Invalidates all previous backup codes and returns a fresh set
function regenerateTotpBackupCodes(c: MalanConfig, user_id: string, password: string, code: string): Promise<TotpBackupCodesResponse> {
  return superagent
    .post(fullUrl(c, `/api/users/${user_id}/totp/backup_codes`))
    .send({ password, code })
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    .catch(handleResponseError)
}

// Admin recovery path for users locked out of MFA. Requires no password or
// code and revokes all of the target user's active sessions.
function adminDeleteTotp(c: MalanConfig, user_id: string): Promise<TotpStatusResponse> {
  return superagent
    .delete(fullUrl(c, `/api/admin/users/${user_id}/totp`))
    .set('Authorization', `Bearer ${c.api_token}`)
    .then(resp => ({ ...resp, data: { ...resp.body.data }, ok: true }))
    .catch(handleResponseError)
}

export {
  TotpStatus,
  TotpEnrollment,
  TotpBackupCodes,
  TotpStatusResponse,
  TotpEnrollmentResponse,
  TotpBackupCodesResponse,
  getTotpStatus,
  startTotpEnrollment,
  confirmTotpEnrollment,
  disableTotp,
  regenerateTotpBackupCodes,
  adminDeleteTotp,
}
