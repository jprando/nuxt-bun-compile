# Nuxt Bun Compile

## 🏗️ Architecture

The module uses a **hook-based architecture**:

- **`nitro:config`** — Adjusts Nitro settings (preset, externals, bundling)
- **`nitro:compiled`** — Triggers `bun build --compile` after Nitro finishes building the server

### How It Works

```
bun run -b build
    │
    ├─ nitro:config hook ──▶ Configure preset, bundling, externals
    │
    ├─ Nuxt/Nitro build pipeline runs normally
    │
    └─ nitro compiled hook ──▶ bun build .output/server/index.mjs --compile --outfile <name>
                                   │
                                   └──▶ 🎉 Standalone binary ready!
```

### Why is `-b` required?

When you run `bun run build` (without `-b`), Bun acts as a **task runner** and may delegate script execution to Node.js. In that scenario, `globalThis.Bun` and `process.versions.bun` **do not exist**, and the module cannot detect the Bun runtime:

```ts
const isBun = typeof globalThis.Bun !== "undefined"
  || process.versions.bun !== undefined;
```
[src/module.ts:L70-L76](https://github.com/jprando/nuxt-bun-compile/blob/main/src/module.ts#L70-L76)

The **`-b`** (or `--bun`) flag forces Bun to be the runtime that executes the script. With it, the variables above become available and the `bun build --compile` step runs correctly.
