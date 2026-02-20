# Nuxt Bun Compile

[![Socket Badge](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)

<div align="center">
  <img src="/images/logo-transparent--nuxt-bun-compile.png" alt="Logo Nuxt Bun Compile" width="50%">
</div>

> 🚀 Módulo Nuxt que configura automaticamente o Nitro para `bun build --compile`, gerando um **binário executável standalone** a partir da sua aplicação Nuxt — sem dependências de runtime.

[Read in English](README.md)

---

## ⚡ Início Rápido

**Passo 1: Instalar o módulo**

```bash
bun nuxt add nuxt-bun-compile
```

**Passo 2: Compilar seu binário**

```bash
bun run -b build
```

[Por que é necessário o parâmetro `-b`?](/docs/ARCHITECTURE.ptBR.md#por-que--b-é-obrigatório)

[Se você enfrentar problemas de memória durante a compilação](/docs/NOTES.ptBR.md#por-que-node_options--max-old-space-size8192)

**Passo 3: Executar seu binário**

```bash
./nuxtbin
# Listening on http://localhost:3000
```

Pronto! Seu binário standalone está pronto.

Só um binário. Sem `node_modules`. Sem runtime. Apenas sua aplicação.

---

- [🎯 O que Faz](/docs/WHAT-IT-DOES.ptBR.md)
- [⚙️ Opções](/docs/OPTIONS.ptBR.md)
- [📦 Pacotes External Padrão](/docs/DEFAULT-EXTERNAL-PACKAGES.ptBR.md)
- [⚠️ Dependências Nativas no Alpine Linux](/docs/NATIVE-DEPENDENCIES-IN-ALPINE-LINUX.ptBR.md)
- [🏗️ Arquitetura](/docs/ARCHITECTURE.ptBR.md)
- [📚 Exemplos de Uso](/docs/USAGE-EXAMPLES.ptBR.md)
- [🧑‍💻 Desenvolvimento](/docs/DEVELOPMENT.ptBR.md)
- [🛠️ Tech Stack](/docs/TECH-STACK.ptBR.md)
- [📝 Notas](/docs/NOTES.ptBR.md)

---

## ✅ Requisitos

- [Bun](https://bun.sh) 1.3.9+ (para a etapa de `--compile`)
- Nuxt 3.x / 4.x
- Node 24+ (quando não usar Bun como runtime)

---

## 📄 Licença

MIT
