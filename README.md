# Lib Malan

Some JavaScript/TypeScript utility functions for accessing the [Malan Authentication Service](https://github.com/FreedomBen/malan)

## Examples:

Note this is not a production-ready example, more of a "how to I start playing with this" example.

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

## Running the tests

### Automated process

The easiest way to run the tests is to use the script that CI uses:

```bash
npm run test:ci
```

This requires that docker and docker-compose be installed.  It will pull the latest
malan image, initialize it and its database, invoke the tests with `npm`, and stop the
malan and database containers.

This is useful if you just want to run tests once with minimal effort.  If you are
developing though, it will have a lot of overhead.  I recommend you use the manual
described next.

### Manual process

The tests expect a [malan](https://github.com/freedomben/malan) to be running on
localhost:4000.  It is highly advised that you do _not_ run them against a staging
or production instance of malan because some test data will most certainly not be
cleaned up properly.

#### 1.  Get a malan instance running

The fastest way to get started is to use the docker-compose file to start a malan
instance:

```bash
docker-compose up malan
```

_Note:  If you're on an ARM device, you need to switch the malan image in
`docker-compose.yml` otherwise malan will crash on startup.  The image name is
already there but is commented out.  You just need to switch the images._

If you prefer a native run (instead of in docker), make sure Elixir and postgres
are installed, then run:

```bash
git clone https://github.com/FreedomBen/malan
cd malan
mix deps.get
mix phx.server
```

#### 2.  Run the tests


```bash
npm run test
```

## Release Process

### Authentication with npm

To publish, you'll need an npm auth token.  There are numerous different ways to
accomplish this, such as running `npm login`.  If you have 2 factor enabled (which
you should if you don't), the easiest way is to issue an automation token.

Put that automation token in the environment variable `NPM_TOKEN` then add to
`libmalan/.npmrc`

```bash
echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' >> .npmrc
```

### To release a new version:

1.  Update version number in `package.json`
1.  Install latest packages:  `npm install`
1.  Run a build:  `npm run build`
1.  Build a tarball you can verify:  `npm pack`
1.  Commit updated package.json and package-lock.json
1.  Tag new version:  Ex:  `git tag v0.0.17`
1.  Push commits and tags:  `git push && git push --tags`
1.  Publish latest version:  `npm publish`
