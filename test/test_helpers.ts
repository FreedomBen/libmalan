import * as users from '../src/users';
import * as sessions from '../src/sessions';

import { base, forSession } from '../test/test_config';

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
  try {
    let aa = rootUserParams()
    const session = (await sessions.login(base, aa.username, aa.password)).data
    aa['session'] = session
    return aa
  } catch(e) {
    console.log('[rootAccount()]: Caught an error retrieving the root account')
    console.dir(e)
    return e.response
  }
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
  try {
    let ra = await users.createUser(base, regularUserParams())
    ra = ra.data
    const session = (await sessions.login(base, ra.username, ra.password)).data
    ra = (await users.acceptTos(forSession(session), ra.id, true)).data
    ra = (await users.acceptPrivacyPolicy(forSession(session), ra.id, true)).data
    ra['session'] = session
    return ra
  } catch(e) {
    console.log('[newRegularAccount()]: Caught an error creating an account')
    console.dir(e)
    return e.response
  }
}

export const uuidRegex = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{10}/

export function testUser() {

}

export function testSession(user) {

}

