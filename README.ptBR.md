# Nuxt Bun Compile

[![Socket Badge](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)

![Logo Nuxt Bun Compile](/images/logo-transparent--nuxt-bun-compile.png "Logo Nuxt Bun Compile")

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

[Por que é necessário o parâmetro `-b`?](https://github.com/jprando/nuxt-bun-compile/blob/main/README.ptBR.md#por-que--b-%C3%A9-obrigat%C3%B3rio)

[Se você enfrentar problemas de memória durante a compilação](https://github.com/jprando/nuxt-bun-compile/blob/main/README.ptBR.md#por-que-node_options--max-old-space-size8192)

**Passo 3: Executar seu binário**

```bash
./nuxtbin
# Listening on http://localhost:3000
```

Pronto! Seu binário standalone está pronto.

Só um binário. Sem `node_modules`. Sem runtime. Apenas sua aplicação.

---

## 🎯 O que Faz

O módulo se conecta ao pipeline de build do Nuxt e cuida de **tudo** automaticamente:

1. **Configura o Nitro** com as configurações ótimas para compilação em binário
2. **Externaliza pacotes problemáticos** que quebram com bundling completo
3. **Executa `bun build --compile`** após o build para produzir um executável standalone

### Configuração do Nitro (aplicada automaticamente)

| Configuração | Valor | Motivo |
|---|---|---|
| `preset` | `"bun"` | Usar o runtime Bun como alvo |
| `noExternals` | `true` | Empacotar tudo no output |
| `inlineDynamicImports` | `true` | Achatar imports dinâmicos para output em arquivo único |
| `serveStatic` | `"inline"` | Embutir assets estáticos no binário |
| `esbuild.options.target` | `"esnext"` | Usar as features JS mais recentes para máximo desempenho |

---

## ⚙️ Opções

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Habilitar/desabilitar o módulo |
| `outfile` | `string` | `"nuxtbin"` | Nome do arquivo binário de saída |
| `bunPath` | `string` | `undefined` | Caminho para o executável do bun. Pode ser um diretório (ex: `/opt/bun/`) ou o caminho direto para o binário (ex: `/opt/bun/bun`). Se for um diretório, '/bun' será anexado. O padrão é 'bun' do PATH do sistema. |
| `target` | `'bun-linux-x64' \| 'bun-linux-x64-musl' \| 'bun-linux-arm64' \| 'bun-linux-arm64-musl'` | `auto-detectado` | Plataforma alvo para compilação do binário. Auto-detecta sua arquitetura (x64/arm64) e tipo de libc (glibc/musl). Sobrescreva apenas se a auto-detecção falhar ou você precisar de um target específico. |
| `extraExternals` | `(string \| RegExp)[]` | `[]` | Pacotes adicionais para marcar como external |
| `autoCompile` | `boolean` | `true` | Executar `bun build --compile` automaticamente após o build |

---

## 📦 Pacotes External Padrão

Estes pacotes são conhecidos por quebrar com `noExternals: true` e são excluídos por padrão:

| Pacote | Pattern |
|---|---|
| sharp | `sharp` |
| @img | `@img/*` |
| css-tree | `css-tree`, `css-tree/*` |
| csso | `csso`, `csso/*` |
| svgo | `svgo` |
| mdn-data | `mdn-data`, `mdn-data/*` |

Precisa adicionar mais? Use `extraExternals`:

```ts
bunCompile: {
  extraExternals: ["problematic-package", /^@scope\//],
}
```

> **⚠️ Importante:** As bibliotecas listadas em `extraExternals` (assim como as externals padrão) **não são embutidas no binário**. Para que o binário `nuxtbin` execute corretamente, essas dependências precisam estar disponíveis em uma pasta `node_modules` ao lado do binário gerado.

---

## ⚠️ Dependências Nativas no Alpine Linux

Ao compilar com `--target=bun-linux-x64-musl` ou `--target=bun-linux-arm64-musl` (Alpine), o binário resultante ainda faz link dinâmico com `libstdc++` e `libgcc` em tempo de execução. Este é um comportamento documentado do Bun:

- [oven-sh/bun#23910](https://github.com/oven-sh/bun/issues/23910)
- [oven-sh/bun#918](https://github.com/oven-sh/bun/issues/918)

### Solução: Instalar Bibliotecas Necessárias no Docker

Se rodar o binário em um container Alpine Linux, instale as bibliotecas necessárias:

```dockerfile
FROM alpine:latest

RUN apk add --no-cache libstdc++ libgcc

COPY nuxtbin /app/
WORKDIR /app

CMD ["./nuxtbin"]
```

Isso garante que todas as dependências de runtime estejam disponíveis no container.

---

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

---

## 🛠️ Tech Stack

| | Tecnologia | Detalhes |
|---|---|---|
| 🔤 | **TypeScript** | Target ESNext, strict mode, bundler resolution |
| 🐰 | **Bun** | Runtime 1.3.9+, gerenciador de pacotes |
| 💚 | **Nuxt** | 4.x |
| 📐 | **dprint** | Formatador de código (TS, JSON, MD, TOML, YAML e mais) |
| 📦 | **ESM** | ES modules puro (`"type": "module"`) |

---

## 🧑‍💻 Desenvolvimento

### Testando Localmente em uma Aplicação Nuxt

```bash
# 1. Clone este repositório para desenvolvimento local
git clone https://github.com/jprando/nuxt-bun-compile.git

# 2. Linke o módulo
cd nuxt-bun-compile && bun install && bun prepack && bun link

# 3. Use em sua aplicação Nuxt
cd sua-app-nuxt && bun link nuxt-bun-compile

# 4. Adicione ao array modules no nuxt.config.ts
bun nuxt add nuxt-bun-compile

# 5. Compile
NODE_OPTIONS="--max-old-space-size=8192" bun run -b build

# 6. Execute o binário
./nuxtbin
```

---

## ✅ Requisitos

- [Bun](https://bun.sh) 1.3.9+ (para a etapa de `--compile`)
- Nuxt 3.x / 4.x
- Node 24+ (quando não usar Bun como runtime)

---

## 📝 Notas

### Por que `NODE_OPTIONS="--max-old-space-size=8192"`?

O processo de build do Nuxt com `noExternals: true` e `inlineDynamicImports: true` faz com que o Rollup/esbuild tente empacotar **todas** as dependências em um único bundle. Em projetos com muitas dependências, isso pode consumir mais memória do que o limite padrão do V8 (aproximadamente 1.5–2 GB), causando o erro:

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

A variável `NODE_OPTIONS="--max-old-space-size=8192"` aumenta o limite de memória heap do V8 para 8 GB, dando margem suficiente para que o bundling termine sem estourar a memória. O valor de `8192` (MB) é uma referência segura para a maioria dos projetos — ajuste conforme necessário para projetos maiores ou máquinas com menos RAM.

> **Nota:** Essa variável afeta o processo do Node.js/V8 que roda o build do Nuxt, e não o binário final gerado pelo `bun build --compile`.

---

## 📄 Licença

MIT
