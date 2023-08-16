import * as sessions from './sessions';
import MalanConfig from './config';
import { base, forSession } from '../test/test_config';

describe('#login', () => {
  it('Returns a new API token', async () => {
    const newSession = await sessions.login(base, "root", "password10", 60)
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
  });
})

describe('#logout', () => {
  it('Returns session as invalid', async () => {
    const newSession = await sessions.login(base, "root", "password10")
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    const updated = await sessions.logout(forSession(newSession), newSession.user_id, newSession.id)
    expect(updated.is_valid).toEqual(false)
  });
})

describe('#logoutCurrent', () => {
  it('Returns session as invalid', async () => {
    const newSession = await sessions.login(base, "root", "password10")
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    const updated = await sessions.logoutCurrent(forSession(newSession))
    expect(updated.is_valid).toEqual(false)
  });
})

describe('#getSession', () => {
  it('Returns session', async () => {
    const newSession = await sessions.login(base, "root", "password10")
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    const updated = await sessions.getSession(forSession(newSession), newSession.user_id, newSession.id)
    expect(updated.id).toEqual(newSession.id)
    expect(updated.is_valid).toEqual(true)
  });
})

describe('#isValid', () => {
  it('Returns session', async () => {
    const newSession = await sessions.login(base, "root", "password10")
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    expect(await sessions.isValid(forSession(newSession), newSession.user_id, newSession.id)).toEqual(true)
    const updated = await sessions.logout(forSession(newSession), newSession.user_id, newSession.id)
    const secondSession = await sessions.login(base, "root", "password10")
    expect(await sessions.isValid(forSession(secondSession), newSession.user_id, newSession.id)).toEqual(false)
  });
})

describe('#extend', () => {
  it('Allows extending a session', async () => {
    // Initialize session, specifying extension parameters
    const newSession = await sessions.login(base, "root", "password10", 60, 120, 90)
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    expect(newSession.max_extension_secs).toEqual(120)
    expect(timeIsClose(newSession.expires_at, 60)).toBe(true)
    expect(timeIsClose(newSession.extendable_until, 120)).toBe(true)

    // Extend session by 90 seconds
    const extendedSession = await sessions.extend(forSession(newSession), 90)
    expect(extendedSession.max_extension_secs).toEqual(120)
    expect(timeIsClose(extendedSession.expires_at, 90)).toBe(true)
    expect(timeIsClose(extendedSession.extendable_until, 120)).toBe(true)
  });
})

function timeIsClose(date: string, seconds: number) {
  const originalDateTime = new Date(date).getTime()
  const desiredDateTime = (new Date().getTime()) + (seconds * 1000)

  // Return true if the difference between the two times is less than 2 seconds
  return Math.abs(originalDateTime - desiredDateTime) < seconds * 2000
}
