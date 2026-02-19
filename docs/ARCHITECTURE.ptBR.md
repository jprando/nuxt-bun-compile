# Nuxt Bun Compile

## 🏗️ Arquitetura

O módulo usa uma **arquitetura baseada em hooks**:

- **`nitro:config`** — Ajusta configurações do Nitro (preset, externals, bundling)
- **`nitro:compiled`** — Aciona `bun build --compile` após o Nitro terminar o build do servidor

### Como Funciona

```
bun run -b build
    │
    ├─ hook nitro:config ──▶ Configura preset, bundling, externals
    │
    ├─ Pipeline de build Nuxt/Nitro executa normalmente
    │
    └─ hook nitro compiled ──▶ bun build .output/server/index.mjs --compile --outfile <nome>
                                   │
                                   └──▶ 🎉 Binário standalone pronto!
```

### Por que `-b` é obrigatório?

Quando você executa `bun run build` (sem `-b`), o Bun age como um **gerenciador de tarefas** e pode delegar a execução do script ao Node.js. Nesse cenário, as variáveis `globalThis.Bun` e `process.versions.bun` **não existem**, e o módulo não consegue detectar o runtime Bun:

```ts
const isBun = typeof globalThis.Bun !== "undefined"
  || process.versions.bun !== undefined;
```
[src/module.ts:L70-L76](https://github.com/jprando/nuxt-bun-compile/blob/main/src/module.ts#L70-L76)

O parâmetro **`-b`** (ou `--bun`) força o Bun a ser o runtime que executa o script. Com ele, as variáveis acima ficam disponíveis e a etapa de `bun build --compile` é executada corretamente.
