# Nuxt Bun Compile

[![Socket Badge](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)

![Logo Nuxt Bun Compile](/images/logo-transparent--nuxt-bun-compile.png "Logo Nuxt Bun Compile")

> 🚀 Nuxt module that automatically configures Nitro for `bun build --compile`, generating a **standalone executable binary** from your Nuxt app — zero runtime dependencies needed.

[Leia em Português](README.ptBR.md)

---

> **⚠️ IMPORTANT: Use `bun run -b build` to generate the binary**
>
> The following commands **DO NOT** trigger binary compilation:
> ```bash
> bun run build        # ❌ does not generate the binary
> npm run build        # ❌ does not generate the binary
> pnpm run build       # ❌ does not generate the binary
> ```
>
> The correct command is:
> ```bash
> bun run -b build     # ✅ generates the binary (nuxtbin or the name set in outfile)
> ```
>
> [Why is `-b` required?](https://github.com/jprando/nuxt-bun-compile?tab=readme-ov-file#why-is--b-required)

---

## 🚀 Super Flash Start

Add the module to any Nuxt project in two steps:

**Step 1: Install the module**

```bash
bun nuxt add nuxt-bun-compile
```

**Step 2: Build your binary**

```bash
bun run -b build
```

Done! Your standalone binary is ready.

---

## ⚡ Quick Start

```bash
# Install from NPM registry
bun add -D nuxt-bun-compile

# Or install directly from GitHub
bun add -D github:jprando/nuxt-bun-compile

# Or link locally for development
git clone https://github.com/jprando/nuxt-bun-compile.git
cd nuxt-bun-compile && bun install && bun link
cd your-nuxt-app && bun link nuxt-bun-compile && bun nuxt add nuxt-bun-compile
```

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-bun-compile"],
  bunCompile: {
    outfile: "myapp",
  },
})
```

Build and run:

```bash
NODE_OPTIONS="--max-old-space-size=8192" bun run -b build
./myapp
```

That's it. One binary. No `node_modules`. No runtime. Just your app.

---

## 🌟 Example

Check out a real project using this module:

- **Repository:** [nuxt-duckdb-wasm](https://github.com/jprando/nuxt-duckdb-wasm)
- **Demo:** [https://nuxt-duckdb-wasm.jeudi.workers.dev/](https://nuxt-duckdb-wasm.jeudi.workers.dev/)

---

## 🎯 What It Does

The module hooks into Nuxt's build pipeline and handles **everything** automatically:

1. **Configures Nitro** with the optimal settings for binary compilation
2. **Externalizes problematic packages** that break with full bundling
3. **Runs `bun build --compile`** after the build to produce a standalone executable

### Nitro Configuration (auto-applied)

| Setting | Value | Why |
|---|---|---|
| `preset` | `"bun"` | Target the Bun runtime |
| `noExternals` | `true` | Bundle everything into the output |
| `inlineDynamicImports` | `true` | Flatten dynamic imports for single-file output |
| `serveStatic` | `"inline"` | Embed static assets in the binary |
| `esbuild.options.target` | `"esnext"` | Use latest JS features for maximum performance |

---

## ⚙️ Options

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Enable/disable the module |
| `outfile` | `string` | `"nuxtbin"` | Output binary filename |
| `bunPath` | `string` | `undefined` | Path to the bun executable. Can be a directory (e.g., `/opt/bun/`) or a direct path to the binary (e.g., `/opt/bun/bun`). If it's a directory, '/bun' will be appended. Defaults to 'bun' from the system's PATH. |
| `extraExternals` | `(string \| RegExp)[]` | `[]` | Additional packages to mark as external |
| `autoCompile` | `boolean` | `true` | Run `bun build --compile` automatically after build |

---

## 📦 Default External Packages

These packages are known to break with `noExternals: true` and are excluded by default:

| Package | Pattern |
|---|---|
| sharp | `sharp` |
| @img | `@img/*` |
| css-tree | `css-tree`, `css-tree/*` |
| csso | `csso`, `csso/*` |
| svgo | `svgo` |
| mdn-data | `mdn-data`, `mdn-data/*` |

Need to add more? Use `extraExternals`:

```ts
bunCompile: {
  extraExternals: ["problematic-package", /^@scope\//],
}
```

> **⚠️ Important:** Libraries listed in `extraExternals` (as well as the default externals) are **not embedded in the binary**. For the `nuxtbin` binary to run correctly, these dependencies must be available in a `node_modules` folder alongside the generated binary.

---

## 🏗️ Architecture

```
src/
  module.ts         # Main module — configures Nitro + auto-compiles
package.json
tsconfig.json
dprint.json         # Code formatter config
```

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

---

## 🛠️ Tech Stack

| | Technology | Details |
|---|---|---|
| 🔤 | **TypeScript** | ESNext target, strict mode, bundler resolution |
| 🐰 | **Bun** | Runtime 1.3.9+, package manager |
| 💚 | **Nuxt** | 3.x / 4.x via `@nuxt/kit` + `@nuxt/schema` |
| 📐 | **dprint** | Code formatter (TS, JSON, MD, TOML, YAML, and more) |
| 📦 | **ESM** | Pure ES modules (`"type": "module"`) |

---

## 🧑‍💻 Development

### Commands

```bash
# Install dependencies
bun install

# Format code
bun run format

# Link for local testing
bun link
```

### Code Style

- **Formatter:** dprint — always run `bun run format` before committing
- **Strings:** Double quotes
- **Semicolons:** Yes
- **Constants:** `UPPER_SNAKE_CASE` for module-level (`DEFAULT_EXTERNALS`)
- **Types:** `interface` for public APIs, `import type` for type-only imports
- **Node built-ins:** Use `node:` prefix (e.g. `node:child_process`)

### Testing Locally in a Nuxt App

```bash
# 1. Link the module
cd nuxt-bun-compile && bun link

# 2. Use it in your Nuxt app
cd your-nuxt-app && bun link nuxt-bun-compile

# 3. Add to nuxt.config.ts modules array

# 4. Build
NODE_OPTIONS="--max-old-space-size=8192" bun run -b build

# 5. Run the binary
./nuxtbin
```

---

## ✅ Requirements

- [Bun](https://bun.sh) 1.3.9+ (for the `--compile` step)
- Nuxt 3.x / 4.x
- Node 24+ (when not using Bun as runtime)

---

## 📝 Notes

### Why `NODE_OPTIONS="--max-old-space-size=8192"`?

The Nuxt build process with `noExternals: true` and `inlineDynamicImports: true` causes Rollup/esbuild to bundle **all** dependencies into a single output. In projects with many dependencies, this can consume more memory than the default V8 heap limit (approximately 1.5–2 GB), resulting in the error:

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

The `NODE_OPTIONS="--max-old-space-size=8192"` variable increases the V8 heap memory limit to 8 GB, providing enough headroom for the bundling process to complete. The value of `8192` (MB) is a safe reference for most projects — adjust as needed for larger projects or machines with less RAM.

> **Note:** This variable affects the Node.js/V8 process that runs the Nuxt build, not the final binary generated by `bun build --compile`.

---

## 📄 License

MIT
