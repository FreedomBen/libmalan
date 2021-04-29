# Lib Malan

Some JavaScript/TypeScript utility functions for accessing the [Malan Authentication Service](https://github.com/FreedomBen/malan)

## Examples:

```typescript
import * as malan from 'libmalan'

let malanConfig = {
  host: "http://127.0.0.1",
  api_token: "",
}

// Log in with username and password
const { id, api_token, user_id } = await malan.login(malanConfig, "username", "password")

// Save API token for later use
malanConfig.api_token = resp.api_token

// Get the user object
const user = (await malan.getUser(malanConfig, user_id)).data

// Get the session object
let session = await malan.getSession(malanConfig, user.id, session_id)

// Validate that the current user token has admin role
const isAdmin = await malan.isValidWithRole(malanConfig, user.id, session_id, "admin")

// Log the user out (this will invalidate the API token)
session = await malan.logout(malanConfig, user.id, session_id)
```

## Release Process

To release a new version:

1.  Update version number in `package.json`
1.  Run a build:  `npm run build`
1.  Build a tarball you can verify:  `npm pack`
1.  Publish latest version:  `npm publish`
