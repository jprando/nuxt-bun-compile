# Nuxt Bun Compile

## 📚 Usage Examples

### Custom Build Script

Create a dedicated npm script in your `package.json`:

```json
{
  "scripts": {
    "build": "nuxt build",
    "compile": "NODE_OPTIONS=\"--max-old-space-size=8192\" bun run -b build"
  }
}
```

Then run: `bun run compile`

### Docker Deployment

Create a `.dockerignore` file to exclude unnecessary files from the docker build context:

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

Deploy the compiled binary in a Docker container using multi-stage build:

```dockerfile
# Stage 1: Base image with Bun runtime
FROM oven/bun:alpine AS bun-base
WORKDIR /app

# Stage 2: Install dependencies
FROM bun-base AS bun-install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Stage 3: Build the binary
FROM bun-base AS bun-build
COPY --from=bun-install /app/node_modules /app/node_modules
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=8192" bun run -b build

# Stage 4: Release (lightweight production image)
FROM alpine:latest AS release
EXPOSE 3000/tcp
WORKDIR /app
# Required libraries for Bun binaries on Alpine
# See: https://github.com/oven-sh/bun/issues/23910
#      https://github.com/oven-sh/bun/issues/918
RUN apk add --no-cache libstdc++ libgcc
COPY --from=bun-build /app/nuxtbin /app/nuxtbin
CMD ["./nuxtbin"]
```

Build and run:
```bash
docker build -t my-nuxt-app .
docker run -p 3000:3000 my-nuxt-app
```

> **Reference:** See the complete multi-stage example in [nuxt-duckdb-wasm/Dockerfile](https://github.com/jprando/nuxt-duckdb-wasm/blob/main/Dockerfile) for a production-ready setup.

### Docker Automation Scripts

Create dedicated npm scripts in your `package.json` for Docker build and run operations:

```json
{
  "scripts": {
    "docker:build": "docker buildx build -t nuxt-bun-compile:latest .",
    "docker:run": "docker run --name nuxt-bun-compile-latest --rm -ti --init -p 3000:3000 nuxt-bun-compile:latest"
  }
}
```

Then run:
```bash
bun run docker:build
bun run docker:run
```

#### Why `--init` is Important in `docker:run`

The **`--init`** flag in the `docker run` command is crucial for proper container lifecycle management:

- **Handles Signals Properly:** Ensures that OS signals (SIGTERM, SIGINT) are correctly forwarded to your application, allowing graceful shutdown
- **Zombie Process Prevention:** Prevents orphaned/zombie processes from accumulating in the container
- **Clean Shutdown:** When you press `Ctrl+C` or the container receives a stop signal, your Nuxt app will terminate cleanly instead of being forcefully killed

Without `--init`, your application may not have time to clean up resources, close database connections, or flush buffers, leading to data loss or inconsistent state.
