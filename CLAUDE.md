# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Agent Instructions

- Use a Test Driven Development (TDD) approach when working on this repo
- Always write comprehensive tests for new functionality
- When changing existing functionality, ensure it has full test coverage and write tests if it does not

## Project

`libmalan` is a TypeScript client library (published to npm) for the [Malan authentication service](https://github.com/FreedomBen/malan). It wraps Malan's HTTP API (via `superagent`) into typed functions for managing users and sessions.

## Common commands

| Task                | Command                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| Build (clean + tsc) | `npm run build`                                                          |
| Run all tests       | `npm test` (alias for `jest --verbose`)                                  |
| Run a single test   | `npx jest src/users.test.ts` or `npx jest -t "creates a user"`           |
| Full CI test cycle  | `npm run test:ci` (docker-compose up → test → down; needs docker)        |
| Debug tests         | `npm run test:debug` (node inspector) or `npm run test:debug:chrome`     |

The package builds to `dist/` (entry `dist/src/index.js`, types `dist/src/index.d.ts`). `prepublishOnly` rebuilds before publish.

## Tests require a live Malan backend

Tests are **integration tests, not unit tests** — they hit a real Malan server at `0.0.0.0:4000` (configured in `test/test_config.ts`). There is no mocking layer. Two ways to provide one:

- **Quickest**: `docker-compose up malan` (uses `freedomben/malan-dev:latest` + postgres). On ARM, switch the image in `docker-compose.yml` to the commented-out `malan-arm-dev` line — otherwise the container crashes on startup.
- **Native**: clone `FreedomBen/malan`, `mix deps.get && mix phx.server`.

Tests assume a freshly-initialized Malan with the default root user (`root` / `password10`, see `test/test_helpers.ts:rootUserParams`). Re-running against dirty state can fail.

## Architecture

- **`src/index.ts`** re-exports everything from `sessions`, `users`, and `errors`. That's the entire public surface.
- **`src/config.ts`** — defines the `MalanConfig` interface (`host`, `api_token`). Every API function takes a `MalanConfig` as its first argument; there is no global client/state.
- **`src/sessions.ts`, `src/users.ts`** — the API functions. They build URLs via `utils.fullUrl`, send via `superagent`, and call `handleResponseError` in `catch` blocks.
- **`src/errors.ts`** — `MalanError extends Error` carries Malan's structured error body (code, detail, token_expired, validation errors). `handleResponseError(e)` is the standard pattern: it type-guards superagent's error response shape and rethrows as `MalanError`, otherwise rethrows untouched. New API calls should follow this pattern.
- **`src/utils.ts`** — `fullUrl()` adds `http://` if the host has no scheme; `BaseResp` is the shared response shape.

### Test layout (slightly unusual)

- Test files are **colocated with source** (`src/users.test.ts`, `src/sessions.test.ts`). Jest's `roots` is `['src']` (see `jest.config.js`), so anything under `test/` is **not auto-discovered**.
- `test/` holds shared helpers imported by the colocated tests: `test_config.ts` (the `base` config pointing at `0.0.0.0:4000`), `test_helpers.ts` (account factories — root/admin/moderator/regular — that lazy-create and cache users via the real API), and `test_setup.ts` (sets a 30s Jest timeout, loaded via `setupFilesAfterEnv`).
- `test/login_test.ts` is **not** run by the default Jest config (it's outside `roots`). Treat it as a standalone script unless you change the config.
- The `dist/` folder ships compiled `*.test.js` files but `package.json`'s `files` array excludes them from the published tarball.

## Release process

Publishing is manual (no CI release pipeline). From the README:

1. Bump `version` in `package.json`.
2. `npm install` (refreshes lockfile).
3. `npm pack` to inspect the tarball.
4. Commit `package.json` + `package-lock.json`.
5. `git tag v0.0.X && git push && git push --tags`.
6. `npm publish` (requires `NPM_TOKEN`; see README for `.npmrc` setup).

## Conventions worth preserving

- Keep API functions stateless: `(config: MalanConfig, ...args) => Promise<...>`. No singletons, no module-level config.
- Wrap superagent calls so errors flow through `handleResponseError` — this gives callers `MalanError` instead of raw superagent objects.
- When adding a new endpoint group, create `src/<name>.ts` and re-export it from `src/index.ts`. Colocate the test as `src/<name>.test.ts`.
