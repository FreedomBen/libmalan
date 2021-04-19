import { login, logout, isValid, getSession } from '../src/sessions';
import { getUser } from '../src/users';

const config = {host: "localhost:4000", api_token: ""}

async function main() {
  // Create a user
  //const new_user = await createUser(config, "jake", "password10")

  // Test login and get api token for other calls
  let resp = await login(config, "ben", "password10")
  const { id, api_token, user_id } = resp
  const session_id = id
  //console.dir(resp.body)
  //console.log('api_token: ' + api_token)
  config.api_token = api_token

  // test user info
  const user = (await getUser(config, user_id)).data
  console.log('user:')
  console.dir(user)
  console.dir(resp)
  console.log('OHIA-------')

  // Test getSession
  let ohai = await getSession(config, user.id, session_id)
  console.log('========================== Resp from isValid')
  console.dir(ohai)
  console.dir(ohai.data)

  // Test isValid
  let session = await isValid(config, user.id, session_id)
  console.log('========================== Resp from isValid')
  console.dir(session.data)

  // Test logout
  console.log('========================== Start from logout')
  session = await logout(config, user.id, session_id)
  console.log('========================== Resp from logout')
  //console.dir(session.data)
}

main()
