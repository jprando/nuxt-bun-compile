# Nuxt Bun Compile

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

