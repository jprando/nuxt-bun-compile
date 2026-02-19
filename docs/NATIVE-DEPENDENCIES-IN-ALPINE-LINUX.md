# Nuxt Bun Compile

## ⚠️ Native Dependencies in Alpine Linux

When compiling with `--target=bun-linux-x64-musl` or `--target=bun-linux-arm64-musl` (Alpine), the resulting binary still dynamically links to `libstdc++` and `libgcc` at runtime. This is documented Bun behavior:

- [oven-sh/bun#23910](https://github.com/oven-sh/bun/issues/23910)
- [oven-sh/bun#918](https://github.com/oven-sh/bun/issues/918)

### Solution: Install Required Libraries in Docker

If running the binary in an Alpine Linux container, install the required libraries:

```dockerfile
FROM alpine:latest

RUN apk add --no-cache libstdc++ libgcc

COPY nuxtbin /app/
WORKDIR /app

CMD ["./nuxtbin"]
```

This ensures all runtime dependencies are available in the container.

When compiling with `--target=bun-linux-x64-musl` or `--target=bun-linux-arm64-musl` (Alpine), the resulting binary still dynamically links to `libstdc++` and `libgcc` at runtime. This is documented Bun behavior:

- [oven-sh/bun#23910](https://github.com/oven-sh/bun/issues/23910)
- [oven-sh/bun#918](https://github.com/oven-sh/bun/issues/918)

### Solution: Install Required Libraries in Docker

If running the binary in an Alpine Linux container, install the required libraries:

```dockerfile
FROM alpine:latest

RUN apk add --no-cache libstdc++ libgcc

COPY nuxtbin /app/
WORKDIR /app

CMD ["./nuxtbin"]
```

This ensures all runtime dependencies are available in the container.

