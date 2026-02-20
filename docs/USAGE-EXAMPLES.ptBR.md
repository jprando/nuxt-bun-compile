# Nuxt Bun Compile

## 📚 Exemplos de Uso

### Script Customizado de Build

Crie um script npm/bun dedicado no seu `package.json`:

```json
{
  "scripts": {
    "build": "nuxt build",
    "compile": "NODE_OPTIONS=\"--max-old-space-size=8192\" bun run -b build"
  }
}
```

Execute com: `bun run compile`

### Deploy com Docker

Crie um arquivo `.dockerignore` para excluir arquivos desnecessários do contexto de docker build:

```
.claude
.devcontainer
.gemini
.git
.github
.husky
.nuxt
.output
.serena
.vscode
.yarn
dist
node_modules
nuxtbin
test
tests
```

Faça deploy do binário compilado em um container Docker usando multi-stage build:

```dockerfile
# Estágio 1: Imagem base com runtime Bun
FROM oven/bun:alpine AS bun-base
WORKDIR /app

# Estágio 2: Instalar dependências
FROM bun-base AS bun-install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Estágio 3: Compilar o binário
FROM bun-base AS bun-build
COPY --from=bun-install /app/node_modules /app/node_modules
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=8192" bun run -b build

# Estágio 4: Release (imagem de produção otimizada)
FROM alpine:latest AS release
EXPOSE 3000/tcp
WORKDIR /app
# Bibliotecas necessárias para binários Bun no Alpine
# Ver: https://github.com/oven-sh/bun/issues/23910
#      https://github.com/oven-sh/bun/issues/918
RUN apk add --no-cache libstdc++ libgcc
COPY --from=bun-build /app/nuxtbin /app/nuxtbin
CMD ["./nuxtbin"]
```

Build e execute:
```bash
docker build -t minha-app-nuxt .
docker run -p 3000:3000 minha-app-nuxt
```

> **Referência:** Veja um exemplo completo com multi-stage em [nuxt-duckdb-wasm/Dockerfile](https://github.com/jprando/nuxt-duckdb-wasm/blob/main/Dockerfile) para um setup pronto para produção.

### Scripts de Automação com Docker

Crie scripts npm/bun dedicados no seu `package.json` para operações de build e execução no Docker:

```json
{
  "scripts": {
    "docker:build": "docker buildx build -t nuxt-bun-compile:latest .",
    "docker:run": "docker run --name nuxt-bun-compile-latest --rm -ti --init -p 3000:3000 nuxt-bun-compile:latest"
  }
}
```

Execute com:
```bash
bun run docker:build
bun run docker:run
```

#### Por que `--init` é Importante em `docker:run`

O parâmetro **`--init`** no comando `docker run` é crucial para o gerenciamento adequado do ciclo de vida do container:

- **Manipula Sinais Corretamente:** Garante que sinais do SO (SIGTERM, SIGINT) sejam corretamente encaminhados para sua aplicação, permitindo shutdown gracioso
- **Previne Processos Zumbis:** Evita que processos órfãos/zumbis se acumulem no container
- **Shutdown Limpo:** Quando você pressiona `Ctrl+C` ou o container recebe um sinal de parada, sua app Nuxt será encerrada de forma limpa em vez de ser forçosamente morta

Sem `--init`, sua aplicação pode não ter tempo para limpar recursos, fechar conexões de banco de dados ou descarregar buffers, resultando em perda de dados ou estado inconsistente.
