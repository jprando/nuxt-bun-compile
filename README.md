# nuxt-bun-compile

Nuxt module that automatically configures Nitro for `bun build --compile`, generating a standalone executable binary from your Nuxt app.

## Setup

```bash
# Install
bun add -D nuxt-bun-compile

# Or link locally
cd nuxt-bun-compile && bun link
cd your-nuxt-app && bun link nuxt-bun-compile
```

Add to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-bun-compile"],
  bunCompile: {
    outfile: "myapp",
  },
})
```

## Usage

```bash
NODE_OPTIONS="--max-old-space-size=8192" bun run build
./myapp
```

The module handles everything: Nitro preset, bundling config, external packages, and the `bun build --compile` step.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Enable/disable the module |
| `outfile` | `string` | `"nuxtbin"` | Output binary filename |
| `extraExternals` | `(string \| RegExp)[]` | `[]` | Additional packages to mark as external |
| `autoCompile` | `boolean` | `true` | Run `bun build --compile` automatically after build |
| `maxMemory` | `number` | `8192` | Reference value for `--max-old-space-size` |

## What it configures

The module sets the following Nitro options automatically:

- `preset: "bun"`
- `noExternals: true`
- `inlineDynamicImports: true`
- `serveStatic: "inline"`
- `esbuild.options.target: "esnext"`

### Default external packages

These packages are known to break with `noExternals` and are excluded by default:

- `sharp`, `@img/*`
- `css-tree`, `css-tree/*`
- `csso`, `csso/*`
- `svgo`
- `mdn-data`, `mdn-data/*`

Add more via `extraExternals`:

```ts
bunCompile: {
  extraExternals: ["problematic-package", /^@scope\//],
}
```

## Requirements

- [Bun](https://bun.sh) runtime (for the `--compile` step)
- Nuxt 3.x / 4.x
