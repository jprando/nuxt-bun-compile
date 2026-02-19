# Nuxt Bun Compile

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
