import * as sessions from './sessions';
import * as totp from './totp';
import * as users from './users';
import { MalanError } from './errors';
import { base, forSession } from '../test/test_config';
import {
  avoidTotpStepBoundary,
  currentTotpCode,
  invalidTotpCodeFor,
  previousTotpCode,
  randomUsername,
  rootAccount,
} from '../test/test_helpers';

const backupCodeRegex = /^[a-zA-Z0-9]{12}$/

// A fresh user per test keeps each test inside its own TOTP verify
// rate-limit budget (5 attempts per 5 minutes per user on a dev server)
async function newTotpAccount() {
  const name = randomUsername()
  const password = `totppass${name}`
  const { data: user } = await users.createUser(base, {
    email: `${name}@libmalan.com`,
    username: name,
    password,
    first_name: `Totp${name}`,
    last_name: "User",
  })
  const session = (await sessions.login(base, name, password)).data
  return { user, password, config: forSession(session) }
}

// Enroll and confirm. Confirms with the previous step's code so callers can
// still use the current step's code afterwards (the server refuses to accept
// a step at or below the last accepted one).
async function enableTotp(account) {
  const enrollment = (await totp.startTotpEnrollment(account.config, account.user.id, account.password)).data
  await avoidTotpStepBoundary()
  const confirmed = (await totp.confirmTotpEnrollment(account.config, account.user.id, previousTotpCode(enrollment.secret_base32))).data
  return { secret_base32: enrollment.secret_base32, backup_codes: confirmed.backup_codes }
}

describe('#getTotpStatus', () => {
  it('Returns status "none" for a user without TOTP', async () => {
    const account = await newTotpAccount()
    const resp = await totp.getTotpStatus(account.config, account.user.id)
    expect(resp.status).toEqual(200)
    expect(resp.data.status).toEqual("none")
    expect(resp.data.confirmed_at).toBeNull()
    expect(resp.data.backup_codes_remaining).toEqual(0)
  });

  it('Accepts "current" as the user id', async () => {
    const account = await newTotpAccount()
    const resp = await totp.getTotpStatus(account.config, "current")
    expect(resp.data.status).toEqual("none")
  });

  it("Rejects reading another user's status", async () => {
    const account = await newTotpAccount()
    const other = await newTotpAccount()
    await expect(totp.getTotpStatus(account.config, other.user.id))
      .rejects.toMatchObject({ code: 401 })
  });
})

describe('#startTotpEnrollment', () => {
  it('Returns the provisioning payload and moves status to "pending"', async () => {
    const account = await newTotpAccount()
    const resp = await totp.startTotpEnrollment(account.config, account.user.id, account.password)
    expect(resp.status).toEqual(201)
    expect(resp.data.secret_base32).toMatch(/^[A-Z2-7]+$/)
    expect(resp.data.otpauth_uri).toMatch(/^otpauth:\/\/totp\//)
    expect(resp.data.qr_code_svg).toContain("<svg")
    const status = await totp.getTotpStatus(account.config, account.user.id)
    expect(status.data.status).toEqual("pending")
  });

  it('Rejects a wrong password', async () => {
    const account = await newTotpAccount()
    const err = await totp.startTotpEnrollment(account.config, account.user.id, "not-the-password").catch(e => e)
    expect(err).toBeInstanceOf(MalanError)
    expect(err.code).toEqual(403)
  });
})

describe('#confirmTotpEnrollment', () => {
  it('Returns backup codes and enables TOTP', async () => {
    const account = await newTotpAccount()
    const enrollment = (await totp.startTotpEnrollment(account.config, account.user.id, account.password)).data
    const resp = await totp.confirmTotpEnrollment(account.config, account.user.id, currentTotpCode(enrollment.secret_base32))
    expect(resp.status).toEqual(200)
    expect(resp.data.backup_codes).toHaveLength(10)
    for (const code of resp.data.backup_codes) {
      expect(code).toMatch(backupCodeRegex)
    }
    const status = await totp.getTotpStatus(account.config, account.user.id)
    expect(status.data.status).toEqual("enabled")
    expect(status.data.confirmed_at).toBeTruthy()
    expect(status.data.backup_codes_remaining).toEqual(10)
  });

  it('Rejects an invalid code', async () => {
    const account = await newTotpAccount()
    const enrollment = (await totp.startTotpEnrollment(account.config, account.user.id, account.password)).data
    await expect(totp.confirmTotpEnrollment(account.config, account.user.id, invalidTotpCodeFor(enrollment.secret_base32)))
      .rejects.toMatchObject({ code: 403, invalid_mfa_code: true })
  });

  it('Returns 404 when there is no pending enrollment', async () => {
    const account = await newTotpAccount()
    await expect(totp.confirmTotpEnrollment(account.config, account.user.id, "123456"))
      .rejects.toMatchObject({ code: 404 })
  });
})

describe('login with TOTP enabled', () => {
  it('Requires a code and accepts a valid TOTP code', async () => {
    const account = await newTotpAccount()
    const { secret_base32 } = await enableTotp(account)

    const err = await sessions.login(base, account.user.username, account.password).catch(e => e)
    expect(err).toBeInstanceOf(MalanError)
    expect(err.code).toEqual(403)
    expect(err.mfa_required).toEqual(true)
    expect(err.mfa_types).toEqual(["totp"])
    expect(err.invalid_mfa_code).toBeUndefined()

    await expect(sessions.login(base, account.user.username, account.password, 0, 0, 0, invalidTotpCodeFor(secret_base32)))
      .rejects.toMatchObject({ code: 403, mfa_required: true, invalid_mfa_code: true })

    // enableTotp confirmed with the previous step's code, so the current
    // step's code is still fresh
    const session = await sessions.login(base, account.user.username, account.password, 0, 0, 0, currentTotpCode(secret_base32))
    expect(session.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    expect(session.authenticated_by).toEqual("password+totp")
  });

  it('Accepts a backup code exactly once', async () => {
    const account = await newTotpAccount()
    const { backup_codes } = await enableTotp(account)

    const session = await sessions.login(base, account.user.username, account.password, 0, 0, 0, backup_codes[0])
    expect(session.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    expect(session.authenticated_by).toEqual("password+backup_code")

    await expect(sessions.login(base, account.user.username, account.password, 0, 0, 0, backup_codes[0]))
      .rejects.toMatchObject({ code: 403, invalid_mfa_code: true })

    const status = await totp.getTotpStatus(account.config, account.user.id)
    expect(status.data.backup_codes_remaining).toEqual(9)
  });
})

describe('#regenerateTotpBackupCodes', () => {
  it('Replaces the backup codes', async () => {
    const account = await newTotpAccount()
    const { backup_codes } = await enableTotp(account)
    const resp = await totp.regenerateTotpBackupCodes(account.config, account.user.id, account.password, backup_codes[0])
    expect(resp.status).toEqual(200)
    expect(resp.data.backup_codes).toHaveLength(10)
    for (const code of resp.data.backup_codes) {
      expect(code).toMatch(backupCodeRegex)
      expect(backup_codes.indexOf(code)).toEqual(-1)
    }
    const status = await totp.getTotpStatus(account.config, account.user.id)
    expect(status.data.backup_codes_remaining).toEqual(10)
  });

  it('Rejects a wrong password', async () => {
    const account = await newTotpAccount()
    const { backup_codes } = await enableTotp(account)
    await expect(totp.regenerateTotpBackupCodes(account.config, account.user.id, "not-the-password", backup_codes[0]))
      .rejects.toMatchObject({ code: 403 })
  });
})

describe('#disableTotp', () => {
  it('Disables TOTP and allows password-only login again', async () => {
    const account = await newTotpAccount()
    const { backup_codes } = await enableTotp(account)
    const resp = await totp.disableTotp(account.config, account.user.id, account.password, backup_codes[0])
    expect(resp.status).toEqual(200)
    expect(resp.data.status).toEqual("none")
    const session = await sessions.login(base, account.user.username, account.password)
    expect(session.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    expect(session.authenticated_by).toEqual("password")
  });

  it('Returns 404 when TOTP is not enabled', async () => {
    const account = await newTotpAccount()
    await expect(totp.disableTotp(account.config, account.user.id, account.password, "123456"))
      .rejects.toMatchObject({ code: 404 })
  });
})

describe('#adminDeleteTotp', () => {
  it('Force-disables TOTP without password or code', async () => {
    const account = await newTotpAccount()
    await enableTotp(account)
    const root = await rootAccount()
    const resp = await totp.adminDeleteTotp(forSession(root.session), account.user.id)
    expect(resp.status).toEqual(200)
    expect(resp.data.status).toEqual("none")
    const session = await sessions.login(base, account.user.username, account.password)
    expect(session.authenticated_by).toEqual("password")
  });

  it('Returns 404 when the user has no TOTP', async () => {
    const account = await newTotpAccount()
    const root = await rootAccount()
    await expect(totp.adminDeleteTotp(forSession(root.session), account.user.id))
      .rejects.toMatchObject({ code: 404 })
  });

  it('Rejects non-admin callers', async () => {
    const account = await newTotpAccount()
    const other = await newTotpAccount()
    await expect(totp.adminDeleteTotp(account.config, other.user.id))
      .rejects.toMatchObject({ code: 401 })
  });
})
