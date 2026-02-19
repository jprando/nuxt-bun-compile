# Nuxt Bun Compile

## ⚙️ Options

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Enable/disable the module |
| `outfile` | `string` | `"nuxtbin"` | Output binary filename |
| `bunPath` | `string` | `undefined` | Path to the bun executable. Can be a directory (e.g., `/opt/bun/`) or a direct path to the binary (e.g., `/opt/bun/bun`). If it's a directory, '/bun' will be appended. Defaults to 'bun' from the system's PATH. |
| `target` | `'bun-linux-x64' \| 'bun-linux-x64-musl' \| 'bun-linux-arm64' \| 'bun-linux-arm64-musl'` | `auto-detected` | Target platform for binary compilation. Auto-detects your system architecture (x64/arm64) and libc type (glibc/musl). Override only if auto-detection fails or you need a specific target. |
| `extraExternals` | `(string \| RegExp)[]` | `[]` | Additional packages to mark as external |
| `autoCompile` | `boolean` | `true` | Run `bun build --compile` automatically after build |
