# nuxt-bun-compile

[![Socket Badge](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)](https://badge.socket.dev/npm/package/nuxt-bun-compile/0.1.0)

> 🚀 Modulo Nuxt que configura automaticamente o Nitro para `bun build --compile`, gerando um **binario executavel standalone** a partir da sua aplicacao Nuxt — sem dependencias de runtime.

[Read in English](README.md)

---

> **⚠️ IMPORTANTE: Use `bun run -b build` para gerar o binario**
>
> Os comandos abaixo **NAO** acionam a compilacao do binario:
> ```bash
> bun run build        # ❌ nao gera o binario
> npm run build        # ❌ nao gera o binario
> pnpm run build       # ❌ nao gera o binario
> ```
>
> O comando correto eh:
> ```bash
> bun run -b build     # ✅ gera o binario (nuxtbin ou o nome definido em outfile)
> ```
>
> [Por que é necessário o parâmetro `-b`?](https://github.com/jprando/nuxt-bun-compile/blob/main/README.ptBR.md#por-que-o--b-eh-obrigatorio)

---

## ⚡ Inicio Rapido

```bash
# Instalar diretamente do GitHub
bun add -D github:jprando/nuxt-bun-compile

# Ou linkar localmente para desenvolvimento
git clone https://github.com/jprando/nuxt-bun-compile.git
cd nuxt-bun-compile && bun install && bun link
cd sua-app-nuxt && bun link nuxt-bun-compile && bun nuxt nuxt-bun-compile
```

Adicione ao seu `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-bun-compile"],
  bunCompile: {
    outfile: "myapp",
  },
})
```

Build e execucao:

```bash
NODE_OPTIONS="--max-old-space-size=8192" bun run -b build
./myapp
```

So isso. Um binario. Sem `node_modules`. Sem runtime. Apenas sua aplicacao.

---

## 🌟 Exemplo

Veja um projeto real utilizando este modulo:

- **Repositorio:** [nuxt-duckdb-wasm](https://github.com/jprando/nuxt-duckdb-wasm)
- **Demo:** [https://nuxt-duckdb-wasm.jeudi.workers.dev/](https://nuxt-duckdb-wasm.jeudi.workers.dev/)

---

## 🎯 O que faz

O modulo se conecta ao pipeline de build do Nuxt e cuida de **tudo** automaticamente:

1. **Configura o Nitro** com as configuracoes otimas para compilacao em binario
2. **Externaliza pacotes problematicos** que quebram com bundling completo
3. **Executa `bun build --compile`** apos o build para produzir um executavel standalone

### Configuracao do Nitro (aplicada automaticamente)

| Configuracao | Valor | Motivo |
|---|---|---|
| `preset` | `"bun"` | Usar o runtime Bun como alvo |
| `noExternals` | `true` | Empacotar tudo no output |
| `inlineDynamicImports` | `true` | Achatar imports dinamicos para output em arquivo unico |
| `serveStatic` | `"inline"` | Embutir assets estaticos no binario |
| `esbuild.options.target` | `"esnext"` | Usar as features JS mais recentes para maximo desempenho |

---

## ⚙️ Opcoes

| Opcao | Tipo | Padrao | Descricao |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Habilitar/desabilitar o modulo |
| `outfile` | `string` | `"nuxtbin"` | Nome do arquivo binario de saida |
| `bunPath` | `string` | `undefined` | Caminho para o executável do bun. Pode ser um diretório (ex: `/opt/bun/`) ou o caminho direto para o binário (ex: `/opt/bun/bun`). Se for um diretório, '/bun' será anexado. O padrão é 'bun' do PATH do sistema. |
| `extraExternals` | `(string \| RegExp)[]` | `[]` | Pacotes adicionais para marcar como external |
| `autoCompile` | `boolean` | `true` | Executar `bun build --compile` automaticamente apos o build |

---

## 📦 Pacotes External Padrao

Estes pacotes sao conhecidos por quebrar com `noExternals: true` e sao excluidos por padrao:

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

> **⚠️ Importante:** As bibliotecas listadas em `extraExternals` (assim como as externals padrao) **nao sao embutidas no binario**. Para que o binario `nuxtbin` execute corretamente, essas dependencias precisam estar disponiveis em uma pasta `node_modules` ao lado do binario gerado.

---

## 🏗️ Arquitetura

```
src/
  module.ts         # Modulo principal — configura o Nitro + auto-compila
package.json
tsconfig.json
dprint.json         # Configuracao do formatador de codigo
```

O modulo usa uma **arquitetura baseada em hooks**:

- **`nitro:config`** — Ajusta configuracoes do Nitro (preset, externals, bundling)
- **`nitro:compiled`** — Aciona `bun build --compile` apos o Nitro terminar o build do servidor

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
                                   └──▶ 🎉 Binario standalone pronto!
```

### Por que o `-b` eh obrigatorio?

Quando voce executa `bun run build` (sem `-b`), o Bun age como um **gerenciador de tarefas** e pode delegar a execucao do script ao Node.js. Nesse cenario, as variaveis `globalThis.Bun` e `process.versions.bun` **nao existem**, e o modulo nao consegue detectar o runtime Bun:

```ts
const isBun = typeof globalThis.Bun !== "undefined"
  || process.versions.bun !== undefined;
```
[src/module.ts:L70-L76](https://github.com/jprando/nuxt-bun-compile/blob/main/src/module.ts#L70-L76)

O parametro **`-b`** (ou `--bun`) forca o Bun a ser o runtime que executa o script. Com ele, as variaveis acima ficam disponiveis e a etapa de `bun build --compile` eh executada corretamente.

---

## 🛠️ Tech Stack

| | Tecnologia | Detalhes |
|---|---|---|
| 🔤 | **TypeScript** | Target ESNext, strict mode, bundler resolution |
| 🐰 | **Bun** | Runtime 1.3.9+, gerenciador de pacotes |
| 💚 | **Nuxt** | 3.x / 4.x via `@nuxt/kit` + `@nuxt/schema` |
| 📐 | **dprint** | Formatador de codigo (TS, JSON, MD, TOML, YAML e mais) |
| 📦 | **ESM** | ES modules puro (`"type": "module"`) |

---

## 🧑‍💻 Desenvolvimento

### Comandos

```bash
# Instalar dependencias
bun install

# Formatar codigo
bun run format

# Linkar para testes locais
bun link
```

### Estilo de Codigo

- **Formatador:** dprint — sempre execute `bun run format` antes de commitar
- **Strings:** Aspas duplas
- **Ponto e virgula:** Sim
- **Constantes:** `UPPER_SNAKE_CASE` para nivel de modulo (`DEFAULT_EXTERNALS`)
- **Tipos:** `interface` para APIs publicas, `import type` para imports somente de tipo
- **Built-ins do Node:** Use prefixo `node:` (ex: `node:child_process`)

### Testando Localmente em uma App Nuxt

```bash
# 1. Linkar o modulo
cd nuxt-bun-compile && bun link

# 2. Usar na sua app Nuxt
cd sua-app-nuxt && bun link nuxt-bun-compile

# 3. Adicionar ao array modules no nuxt.config.ts

# 4. Build
NODE_OPTIONS="--max-old-space-size=8192" bun run -b build

# 5. Executar o binario
./nuxtbin
```

---

## ✅ Requisitos

- [Bun](https://bun.sh) 1.3.9+ (para a etapa de `--compile`)
- Nuxt 3.x / 4.x
- Node 24+ (quando nao usar Bun como runtime)

---

## 📝 Notas

### Por que `NODE_OPTIONS="--max-old-space-size=8192"`?

O processo de build do Nuxt com `noExternals: true` e `inlineDynamicImports: true` faz com que o Rollup/esbuild tente empacotar **todas** as dependencias em um unico bundle. Em projetos com muitas dependencias, isso pode consumir mais memoria do que o limite padrao do V8 (aproximadamente 1.5–2 GB), causando o erro:

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

A variavel `NODE_OPTIONS="--max-old-space-size=8192"` aumenta o limite de memoria heap do V8 para 8 GB, dando margem suficiente para que o bundling termine sem estourar a memoria. O valor de `8192` (MB) eh uma referencia segura para a maioria dos projetos — ajuste conforme necessario para projetos maiores ou maquinas com menos RAM.

> **Nota:** Essa variavel afeta o processo do Node.js/V8 que roda o build do Nuxt, e nao o binario final gerado pelo `bun build --compile`.

---

## 📄 Licenca

MIT
