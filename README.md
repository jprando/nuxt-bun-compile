# Nuxt Bun Compile

[![Socket Badge](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)

![Logo Nuxt Bun Compile](/images/logo-transparent--nuxt-bun-compile.png "Logo Nuxt Bun Compile")

> 🚀 Nuxt module that automatically configures Nitro for `bun build --compile`, generating a **standalone executable binary** from your Nuxt app — zero runtime dependencies needed.

[Leia em Português](README.ptBR.md)

---

## ⚡ Quick Start

**Step 1: Install the module**

```bash
bun nuxt add nuxt-bun-compile
```

**Step 2: Build your binary**

```bash
bun run -b build
```

[Why is `-b` required?](https://github.com/jprando/nuxt-bun-compile?tab=readme-ov-file#why-is--b-required)

[If you encounter memory issues during build](https://github.com/jprando/nuxt-bun-compile?tab=readme-ov-file#why-node_options--max-old-space-size8192)

**Step 3: Run your binary**

```bash
./nuxtbin
# Listening on http://localhost:3000
```

Done! Your standalone binary is ready.

That's it. One binary. No `node_modules`. No runtime. Just your app.

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
| 💚 | **Nuxt** | 4.x |
| 📐 | **dprint** | Code formatter (TS, JSON, MD, TOML, YAML, and more) |
| 📦 | **ESM** | Pure ES modules (`"type": "module"`) |

---

## 🧑‍💻 Development

### Testing Locally in a Nuxt App

```bash
# 1. Clone this repo for local development
git clone https://github.com/jprando/nuxt-bun-compile.git

# 2. Link the module
cd nuxt-bun-compile && bun install && bun prepack && bun link

# 3. Use it in your Nuxt app
cd your-nuxt-app && bun link nuxt-bun-compile

# 4. Add to nuxt.config.ts modules array
bun nuxt add nuxt-bun-compile

# 5. Build
NODE_OPTIONS="--max-old-space-size=8192" bun run -b build

# 6. Run the binary
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
