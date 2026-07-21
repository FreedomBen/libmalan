import * as crypto from 'crypto';

import * as users from '../src/users';
import * as sessions from '../src/sessions';

import { base, forSession } from '../test/test_config';

let root_account
let admin_account
let moderator_account
let regular_account

function rootUserParams() {
  return {
    email: `root@example.com`,
    username: `root`,
    password: `password10`,
    first_name: `Root`,
    last_name: 'User',
  }
}

function adminUserParams() {
  const num = randomStr()
  return {
    email: `adminuser${num}@libmalan.com`,
    username: `adminuser${num}`,
    password: `adminuser@libmalan.com`,
    first_name: `Admin{num}`,
    last_name: 'User',
  }
}

function moderatorUserParams() {
  const num = randomStr()
  return {
    email: `moderatoruser${num}@libmalan.com`,
    username: `moderatoruser${num}`,
    password: `moderatoruser@libmalan.com`,
    first_name: `Moderator{num}`,
    last_name: 'User',
  }
}

function regularUserParams() {
  const num = randomStr()
  return {
    email: `regularuser${num}@libmalan.com`,
    username: `regularuser${num}`,
    password: `regularuser@libmalan.com`,
    first_name: `Regular${num}`,
    last_name: 'User',
  }
}

export const randomStr = () => Math.random().toString().replace(/\./g, "")
export const randomUsername = () => `test${randomStr()}`

export async function rootAccount(): Promise<any> {
  if (!root_account) {
    root_account = await loginRootAccount()
    return root_account
  } else {
    return root_account
  }
}

export async function loginRootAccount(): Promise<any> {
  let root = rootUserParams()
  const session = (await sessions.login(base, root.username, root.password)).data
  root['session'] = session
  return root
}

export async function adminAccount(): Promise<any> {
  if (!admin_account) {
    admin_account = (await users.createUser(base, adminUserParams())).data;
    return admin_account
  } else {
    return admin_account
  }
}

export async function moderatorAccount(): Promise<any> {
  if (!moderator_account) {
    moderator_account = (await users.createUser(base, moderatorUserParams())).data;
    return moderator_account
  } else {
    return moderator_account
  }
}

export async function regularAccount(): Promise<users.UserResponse & { session: sessions.SessionResponse }> {
  if (!regular_account) {
    regular_account = await newRegularAccount()
    return regular_account
  } else {
    return regular_account
  }
}

export async function newRegularAccount(): Promise<users.BaseUserResp & { session?: sessions.SessionResponse }> {
  let ra = await users.createUser(base, regularUserParams())
  ra = ra.data
  const session = (await sessions.login(base, ra.username, ra.password)).data
  ra = (await users.acceptTos(forSession(session), ra.id, true)).data
  ra = (await users.acceptPrivacyPolicy(forSession(session), ra.id, true)).data
  ra['session'] = session
  return ra
}

export const uuidRegex = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{10}/

// TOTP (RFC 6238) code generation, used to drive the real MFA endpoints in
// tests. Malan uses NimbleTOTP defaults: HMAC-SHA1, 6 digits, 30-second
// steps, accepting the current or previous step. Replay protection means an
// accepted step can never be used again for that user.

export const TOTP_PERIOD_SECS = 30

function base32Decode(encoded: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let bits = 0
  let value = 0
  const bytes = []
  for (const char of encoded.toUpperCase().replace(/=+$/, "")) {
    const index = alphabet.indexOf(char)
    if (index === -1) {
      throw new Error(`Invalid base32 character: ${char}`)
    }
    value = (value << 5) | index
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(bytes)
}

export function totpCodeAt(secretBase32: string, timeSecs: number): string {
  const step = Math.floor(timeSecs / TOTP_PERIOD_SECS)
  const counter = Buffer.alloc(8)
  counter.writeUInt32BE(Math.floor(step / 0x100000000), 0)
  counter.writeUInt32BE(step % 0x100000000, 4)
  const digest = crypto.createHmac("sha1", base32Decode(secretBase32)).update(counter).digest()
  const offset = digest[digest.length - 1] & 0x0f
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    (digest[offset + 1] << 16) |
    (digest[offset + 2] << 8) |
    digest[offset + 3]
  const code = String(binary % 1000000)
  return "000000".slice(code.length) + code
}

export const nowSecs = () => Math.floor(Date.now() / 1000)

export const currentTotpCode = (secretBase32: string) => totpCodeAt(secretBase32, nowSecs())

export const previousTotpCode = (secretBase32: string) =>
  totpCodeAt(secretBase32, nowSecs() - TOTP_PERIOD_SECS)

// A code that is valid for neither the current nor the previous step
export function invalidTotpCodeFor(secretBase32: string): string {
  const valid = [currentTotpCode(secretBase32), previousTotpCode(secretBase32)]
  return ["000000", "111111", "222222"].find((code) => valid.indexOf(code) === -1)
}

// Tests that verify two codes back to back confirm enrollment with the
// previous step's code, then use the current step's for the next call.
// That pairing breaks if the clock crosses a step boundary between the two
// requests, so wait out the boundary when it is close.
export async function avoidTotpStepBoundary(marginSecs = 3): Promise<void> {
  const intoStep = nowSecs() % TOTP_PERIOD_SECS
  if (intoStep >= TOTP_PERIOD_SECS - marginSecs) {
    await new Promise((resolve) => setTimeout(resolve, (TOTP_PERIOD_SECS - intoStep + 1) * 1000))
  }
}

export function testUser() {

}

export function testSession(user) {

}

