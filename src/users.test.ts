import * as users from './users';
import MalanConfig from './config';
import { base, forSession } from '../test/test_config';

import { regularAccount, newRegularAccount, uuidRegex, randomUsername } from '../test/test_helpers';
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

    const error = await users.getUser(forSession(ra.session), ra.id)
      .then(
        () => {throw new Error('should not succeed')},
        (e) => e
      );

    expect(error.status).toBe(404)
  });
})
