# nuxt-bun-compile

> 🚀 Nuxt module that automatically configures Nitro for `bun build --compile`, generating a **standalone executable binary** from your Nuxt app — zero runtime dependencies needed.

---

## ⚡ Quick Start

```bash
# Install
bun add -D nuxt-bun-compile

# Or link locally for development
cd nuxt-bun-compile && bun link
cd your-nuxt-app && bun link nuxt-bun-compile
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
NODE_OPTIONS="--max-old-space-size=8192" bun run build
./myapp
```

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
| `extraExternals` | `(string \| RegExp)[]` | `[]` | Additional packages to mark as external |
| `autoCompile` | `boolean` | `true` | Run `bun build --compile` automatically after build |
| `maxMemory` | `number` | `8192` | Reference value for `--max-old-space-size` (MB) |

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

> **⚠️ Importante:** As bibliotecas listadas em `extraExternals` (assim como as externals padrão) **não são embutidas no binário**. Para que o binário `nuxtbin` execute corretamente, essas dependências precisam estar disponíveis em uma pasta `node_modules` ao lado do binário gerado.

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
- **`close`** — Triggers `bun build --compile` after the build finishes

### How It Works

```
nuxt build
    │
    ├─ nitro:config hook ──▶ Configure preset, bundling, externals
    │
    ├─ Nuxt/Nitro build pipeline runs normally
    │
    └─ close hook ──▶ bun build .output/server/index.mjs --compile --outfile <name>
                          │
                          └──▶ 🎉 Standalone binary ready!
```

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
NODE_OPTIONS="--max-old-space-size=8192" bun run build

# 5. Run the binary
./nuxtbin
```

---

## ✅ Requirements

- [Bun](https://bun.sh) 1.3.9+ (for the `--compile` step)
- Nuxt 3.x / 4.x
- Node 24+ (when not using Bun as runtime)

---

## 📄 License

MIT