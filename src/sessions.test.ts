import * as sessions from './sessions';
import MalanConfig from './config';
import { base, forSession } from '../test/test_config';

describe('#login', () => {
  it('Returns a new API token', async () => {
    const newSession = await sessions.login(base, "ben", "password10")
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
  });
})

describe('#logout', () => {
  it('Returns session as invalid', async () => {
    const newSession = await sessions.login(base, "ben", "password10")
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    const updated = await sessions.logout(forSession(newSession), newSession.user_id, newSession.id)
    expect(updated.is_valid).toEqual(false)
  });
})

describe('#getSession', () => {
  it('Returns session', async () => {
    const newSession = await sessions.login(base, "ben", "password10")
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    const updated = await sessions.getSession(forSession(newSession), newSession.user_id, newSession.id)
    expect(updated.id).toEqual(newSession.id)
    expect(updated.is_valid).toEqual(true)
  });
})

describe('#isValid', () => {
  it('Returns session', async () => {
    const newSession = await sessions.login(base, "ben", "password10")
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
    expect(await sessions.isValid(forSession(newSession), newSession.user_id, newSession.id)).toEqual(true)
    const updated = await sessions.logout(forSession(newSession), newSession.user_id, newSession.id)
    const secondSession = await sessions.login(base, "ben", "password10")
    expect(await sessions.isValid(forSession(secondSession), newSession.user_id, newSession.id)).toEqual(false)
  });
})
