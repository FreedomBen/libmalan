import * as users from './users';
import * as sessions from './sessions';
import MalanConfig from './config';
import { base, forSession } from '../test/test_config';

import { adminAccount, regularAccount, newRegularAccount, rootAccount, uuidRegex, randomUsername } from '../test/test_helpers';
import { MalanError } from './errors';

describe('#getUser', () => {
  it('Gets a user by ID', async () => {
    const ra = await regularAccount()
    const user = await users.getUser(forSession(ra.session), ra.id)
    expect(user.data.id).toEqual(ra.id)
  });
})

describe('#getUserByUsername', () => {
  it('Gets a user by ID', async () => {
    const ra = await regularAccount()
    const user = await users.getUserByUsername(forSession(ra.session), ra.username)
    expect(user.data.id).toEqual(ra.id)
  });
})

describe('#whoamiFull', () => {
  it('Gets a user by API token', async () => {
    const ra = await regularAccount()
    const user = await users.whoamiFull(forSession(ra.session))
    expect(user.data.id).toEqual(ra.id)
  });
})

describe('#whoami', () => {
  it('Gets an abbreviated user by API token', async () => {
    const ra = await regularAccount()
    const user = await users.whoami(forSession(ra.session))
    expect(user.data.user_id).toEqual(ra.id)
  });
})

describe('#createUser', () => {
  it('Creates a new user', async () => {
    const rando = randomUsername()
    const custom_attrs = {
      guid: "ABCDEFGHIJKLMNOP",
      age: 18,
      names: {
        first: "Edgar",
        last: "Poe",
      }
    }
    const date = new Date()
    const userParams = {
      email: `${rando}@libmalan.com`,
      username: `${rando}`,
      password: `testuser@libmalan.com`,
      first_name: `Tester${rando}`,
      last_name: 'Buddy',
      phone_numbers: [{number: '111-435-1334'}],
      birthday: date,
      custom_attrs: custom_attrs,
    }
    const newUser = await users.createUser(base, userParams)
    expect(newUser.data.id).toMatch(uuidRegex)
    expect(newUser.data.email).toMatch(/@libmalan.com$/)
    expect(newUser.data.username).toMatch(/^test/)
    expect(newUser.data.last_name).toEqual('Buddy')
    expect(newUser.data.custom_attrs).toEqual(custom_attrs)
    expect(newUser.data.birthday).toEqual(date.toISOString().split('T')[0])
  });

  it("Errors with duplicate email", async () => {
    const username = randomUsername()
    const userParams = {
      email: `${username}@libmalan.com`,
      username,
      password: `testuser@libmalan.com`,
      first_name: `Tester${username}`,
      last_name: 'Buddy',
      phone_numbers: [{number: '111-435-1334'}],
      birthday: new Date(),
    }
    await users.createUser(base, userParams)

    const error = await users.createUser(base, userParams)
      .then(
        () => {throw new Error('should not succeed')},
        (e) => e
      );
    expect(error).toBeInstanceOf(MalanError)
    expect(error.errors).toMatchObject({
      username: ["has already been taken"]
    });
  });
})

describe('#acceptTos', () => {
  it('Rejects and Accepts the Terms of Service', async () => {
    const ra = await regularAccount()

    const origUser = await users.getUser(forSession(ra.session), ra.id)
    expect(origUser.data.tos_accepted).toEqual(true)

    const rejectedUser = await users.acceptTos(forSession(ra.session), ra.id, false)
    expect(rejectedUser.data.tos_accepted).toEqual(false)

    const acceptedUser = await users.acceptTos(forSession(ra.session), ra.id, true)
    expect(acceptedUser.data.tos_accepted).toEqual(true)
  });
})

describe('#acceptPrivacyPolicy', () => {
  it('Rejects and Accepts the Privacy Policy', async () => {
    const ra = await regularAccount()

    const origUser = await users.getUser(forSession(ra.session), ra.id)
    expect(origUser.data.privacy_policy_accepted).toEqual(true)

    const rejectedUser = await users.acceptPrivacyPolicy(forSession(ra.session), ra.id, false)
    expect(rejectedUser.data.privacy_policy_accepted).toEqual(false)

    const acceptedUser = await users.acceptPrivacyPolicy(forSession(ra.session), ra.id, true)
    expect(acceptedUser.data.privacy_policy_accepted).toEqual(true)
  });
})

describe('adminResetPasswordRequest', () => {
  it('Requests a password reset token', async () => {
    const ra = await regularAccount()
    const root = await rootAccount()

    const origUser = await users.getUser(forSession(ra.session), ra.id)
    const resetRequest = await users.adminResetPasswordRequest(forSession(root.session), ra.id)
    expect(resetRequest.data.password_reset_token).toMatch(/[a-zA-Z0-9]{60}/)
  });
})

describe('adminResetPassword', () => {
  it('Requests a password reset token', async () => {
    const newPassword = "rabdinbewoasswird"
    const ra = await newRegularAccount()
    const root = await rootAccount()

    const origUser = await users.getUser(forSession(ra.session), ra.id)
    const resetRequest = await users.adminResetPasswordRequest(forSession(root.session), ra.id)
    expect(resetRequest.data.password_reset_token).toMatch(/[a-zA-Z0-9]{60}/)

    const resetResponse = await users.adminResetPassword(forSession(root.session), resetRequest.data.password_reset_token, newPassword)
    expect(resetResponse.ok).toEqual(true)

    // Login to verify new password
    const newSession = await sessions.login(base, ra.username, newPassword)
    expect(newSession.api_token).toMatch(/[a-zA-Z0-9]{60}/)
  });
})

describe('#updateUser', () => {
  it('Accepts updates to the user', async () => {
    const ra = await regularAccount()
    const custom_attrs = {
      guid: "ABCDEFGHIJKLMNOP",
      age: 18,
      names: {
        first: "Edgar",
        last: "Poe",
      }
    }
    const updateParams = {
      email: "fakeemail@example.com",
      nick_name: "new nickname",
      sex: "Female",
      gender: "Transgender Person",
      race: ["Black or African American"],
      ethnicity: "Hispanic or Latinx",
      birthday: "2017-03-24T01:09:08Z",
      weight: 145.8,
      height: 69.5,
      custom_attrs: custom_attrs,
    }
    const updatedUser = (await users.updateUser(forSession(ra.session), ra.id, updateParams)).data
    const retrievedUser = (await users.getUser(forSession(ra.session), ra.id)).data

    expect(updatedUser.tos_accepted).toEqual(true)
    expect(updatedUser.privacy_policy_accepted).toEqual(true)
    expect(updatedUser.email).toMatch(/regularuser[0-9]+@libmalan.com/)
    expect(updatedUser.nick_name).toEqual("new nickname")
    expect(updatedUser.sex).toEqual("Female")
    expect(updatedUser.gender).toEqual("Transgender Person")
    expect(updatedUser.race).toEqual(["Black or African American"])
    expect(updatedUser.ethnicity).toEqual("Hispanic or Latinx")
    expect(updatedUser.birthday).toMatch(/^2017-03-24/)
    expect(updatedUser.weight).toEqual("145.8")
    expect(updatedUser.height).toEqual("69.5")
    expect(updatedUser.custom_attrs).toEqual(custom_attrs)

    expect(retrievedUser.tos_accepted).toEqual(true)
    expect(retrievedUser.privacy_policy_accepted).toEqual(true)
    expect(retrievedUser.email).toMatch(/regularuser[0-9]+@libmalan.com/)
    expect(retrievedUser.nick_name).toEqual("new nickname")
    expect(retrievedUser.sex).toEqual("Female")
    expect(retrievedUser.gender).toEqual("Transgender Person")
    expect(retrievedUser.race).toEqual(["Black or African American"])
    expect(retrievedUser.ethnicity).toEqual("Hispanic or Latinx")
    expect(retrievedUser.birthday).toMatch(/^2017-03-24/)
    expect(retrievedUser.weight).toEqual("145.8")
    expect(retrievedUser.height).toEqual("69.5")
    expect(retrievedUser.custom_attrs).toEqual(custom_attrs)
  });
})

describe('#adminUpdateUser', () => {
  it('Accepts updates to the user', async () => {
    const ra = await regularAccount()
    const custom_attrs = {
      guid: "ABCDEFGHIJKLMNOP",
      age: 18,
      names: {
        first: "Edgar",
        last: "Poe",
      }
    }
    const updateParams = {
      username: "totallynewusername",
      email: "fakeemail@example.com",
      nick_name: "new nickname",
      sex: "Female",
      gender: "Transgender Person",
      race: ["Black or African American"],
      ethnicity: "Hispanic or Latinx",
      birthday: "2017-03-24T01:09:08Z",
      weight: 145.8,
      height: 69.5,
      custom_attrs: custom_attrs,
    }
    const updatedUser = (await users.updateUser(forSession(ra.session), ra.id, updateParams)).data
    const retrievedUser = (await users.getUser(forSession(ra.session), ra.id)).data

    expect(updatedUser.tos_accepted).toEqual(true)
    expect(updatedUser.privacy_policy_accepted).toEqual(true)
    expect(updatedUser.email).toMatch(/regularuser[0-9]+@libmalan.com/)
    expect(updatedUser.nick_name).toEqual("new nickname")
    expect(updatedUser.sex).toEqual("Female")
    expect(updatedUser.gender).toEqual("Transgender Person")
    expect(updatedUser.race).toEqual(["Black or African American"])
    expect(updatedUser.ethnicity).toEqual("Hispanic or Latinx")
    expect(updatedUser.birthday).toMatch(/^2017-03-24/)
    expect(updatedUser.weight).toEqual("145.8")
    expect(updatedUser.height).toEqual("69.5")
    expect(updatedUser.custom_attrs).toEqual(custom_attrs)

    expect(retrievedUser.tos_accepted).toEqual(true)
    expect(retrievedUser.privacy_policy_accepted).toEqual(true)
    expect(retrievedUser.email).toMatch(/regularuser[0-9]+@libmalan.com/)
    expect(retrievedUser.nick_name).toEqual("new nickname")
    expect(retrievedUser.sex).toEqual("Female")
    expect(retrievedUser.gender).toEqual("Transgender Person")
    expect(retrievedUser.race).toEqual(["Black or African American"])
    expect(retrievedUser.ethnicity).toEqual("Hispanic or Latinx")
    expect(retrievedUser.birthday).toMatch(/^2017-03-24/)
    expect(retrievedUser.weight).toEqual("145.8")
    expect(retrievedUser.height).toEqual("69.5")
    expect(retrievedUser.custom_attrs).toEqual(custom_attrs)
  });
})

describe('#deleteUser', () => {
  it('Deletes a user by ID', async () => {
    const ra = await newRegularAccount()
    const result = await users.deleteUser(forSession(ra.session), ra.id)

    expect(result.ok).toEqual(true);

    const e1 = await users.getUser(forSession(ra.session), ra.id)
      .then(
        () => {throw new Error('should not succeed')},
        (e) => e
      );

    // The session token should be revoked so expect a 403
    expect(e1).toBeInstanceOf(MalanError)
    expect(e1.code).toBe(403)

    // Grab an admin token and make sure the user 404s
    const aa = await rootAccount()
    const e2 = await users.getUser(forSession(aa.session), ra.id)
      .then(
        () => {throw new Error('should not succeed')},
        (e) => e
      );

    expect(e2).toBeInstanceOf(MalanError)
    expect(e2.code).toBe(404)
  });
})

describe('#adminLogoutUser', () => {
  it('Logs out a user by invalidating their sessions', async () => {
    const ra = await regularAccount()
    const aa = await rootAccount()
    
    const userBefore = await users.whoami(forSession(ra.session))
    expect(userBefore.data.user_id).toEqual(ra.id)
    
    const result = await users.adminLogoutUser(forSession(aa.session), ra.id)
    expect(result.ok).toEqual(true)
    
    const error = await users.whoami(forSession(ra.session))
      .then(
        () => {throw new Error('should not succeed')},
        (e) => e
      );
    
    expect(error).toBeInstanceOf(MalanError)
    expect(error.code).toBe(403)
  });

  it('Prevents non-admin users from logging out other users', async () => {
    const ra1 = await regularAccount()
    const ra2 = await regularAccount()
    
    const error = await users.adminLogoutUser(forSession(ra1.session), ra2.id)
      .then(
        () => {throw new Error('should not succeed')},
        (e) => e
      );
    
    expect(error).toBeInstanceOf(MalanError)
    expect(error.code).toBe(403)
    
    const user = await users.whoami(forSession(ra2.session))
    expect(user.data.user_id).toEqual(ra2.id)
  });
})
