# Nuxt Bun Compile

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
