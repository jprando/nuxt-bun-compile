# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Nuxt module that configures Nitro for `bun build --compile`, producing a standalone executable binary with zero runtime dependencies. The entire module logic lives in `src/module.ts`.

## Commands

```bash
bun install                  # Install dependencies
bun run dev:prepare          # Build module stubs + prepare playground (required before dev/test)
bun run dev                  # Start playground dev server (runs dev:prepare first)
bun run dev:build            # Build the playground Nuxt app
bun run test                 # Run tests (vitest)
bun run test -- -t "renders" # Run a single test by name
bun run lint                 # ESLint
bun run format               # dprint formatter
bun run prepack              # Build the module for publishing (nuxt-module-build)
bun run test:types           # Type-check with vue-tsc
```

## Architecture

**Single-file module**: `src/module.ts` is the entire module. It uses `defineNuxtModule` from `@nuxt/kit` and hooks into two Nitro lifecycle events:
- `nitro:config` — Sets Nitro preset to `bun`, enables full bundling (`noExternals`, `inlineDynamicImports`, `serveStatic: 'inline'`), and configures rollup externals for packages that break when fully bundled
- `nitro:compiled` (via `nitroConfig.hooks.compiled`) — Runs `bun build --compile` on the built output to produce a standalone binary

**Module options** are configured under the `bunCompile` key in `nuxt.config.ts`. The `ModuleOptions` interface is exported from `src/module.ts`.

**Test fixture**: `test/fixtures/basic/` is a minimal Nuxt app that imports the module directly from source. Tests use `@nuxt/test-utils/e2e` with `setup()` pointing to this fixture.

**Playground**: `playground/` is a workspace-linked Nuxt app for manual development testing. It imports the module by name (resolved via workspace).

## Code Style

- **Formatter**: dprint (not Prettier). Config in `dprint.json`.
- **Single quotes**, **no semicolons** (ASI mode), 2-space indent
- **Linter**: ESLint with `@nuxt/eslint-config/flat` (includes stylistic rules)
- Use `node:` prefix for Node.js built-in imports
- Use `import type` for type-only imports
- `UPPER_SNAKE_CASE` for module-level constants

## Key Constraint

`bun run -b build` (with the `-b` flag) is required to generate the binary. Without `-b`, Bun delegates to Node.js and the Bun runtime detection (`globalThis.Bun` / `process.versions.bun`) fails, skipping the compile step.
