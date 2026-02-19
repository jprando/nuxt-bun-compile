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
