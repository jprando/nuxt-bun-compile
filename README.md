# Nuxt Bun Compile

[![Socket Badge](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)](https://badge.socket.dev/npm/package/nuxt-bun-compile/latest)
![NPM Downloads](https://img.shields.io/npm/dm/nuxt-bun-compile?style=flat&colorA=020420&colorB=00DC82)
![NPM Last Update](https://img.shields.io/npm/last-update/nuxt-bun-compile?style=flat&colorA=020420&colorB=00DC82)
![NPM Type Definitions](https://img.shields.io/npm/types/nuxt-bun-compile?style=flat&colorA=020420&colorB=00DC82)
![NPM Version (with dist tag)](https://img.shields.io/npm/v/nuxt-bun-compile/latest?style=flat&colorA=020420&colorB=00DC82)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/nuxt-bun-compile?style=flat&colorA=020420&colorB=00DC82)
![NPM License](https://img.shields.io/npm/l/nuxt-bun-compile?style=flat&colorA=020420&colorB=00DC82)

<div align="center">
  <img src="/images/logo-transparent--nuxt-bun-compile.png" alt="Logo Nuxt Bun Compile" width="50%">
</div>

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

[Why is `-b` required?](/docs/ARCHITECTURE.md#why-is--b-required)

[If you encounter memory issues during build](/docs/NOTES.md#why-node_options--max-old-space-size8192)

**Step 3: Run your binary**

```bash
./nuxtbin
# Listening on http://localhost:3000
```

Done! Your standalone binary is ready.

That's it. One binary. No `node_modules`. No runtime. Just your app.

---

- [🎯 What It Does](/docs/WHAT-IT-DOES.md)
- [⚙️ Options](/docs/OPTIONS.md)
- [📦 Default External Packages](/docs/DEFAULT-EXTERNAL-PACKAGES.md)
- [⚠️ Native Dependencies in Alpine Linux](/docs/NATIVE-DEPENDENCIES-IN-ALPINE-LINUX.md)
- [🏗️ Architecture](/docs/ARCHITECTURE.md)
- [📚 Usage Examples](/docs/USAGE-EXAMPLES.md)
- [🧑‍💻 Development](/docs/DEVELOPMENT.md)
- [🛠️ Tech Stack](/docs/TECH-STACK.md)
- [📝 Notes](/docs/NOTES.md)

---

## ✅ Requirements

- [Bun](https://bun.sh) 1.3.9+ (for the `--compile` step)
- Nuxt 3.x / 4.x
- Node 24+ (when not using Bun as runtime)

---

## 📄 License

MIT
