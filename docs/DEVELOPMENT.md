# Nuxt Bun Compile

## 🧑‍💻 Development

### Testing Locally in a Nuxt App

```bash
# 1. Clone this repo for local development
git clone https://github.com/jprando/nuxt-bun-compile.git

# 2. Link the module
cd nuxt-bun-compile && bun install && bun prepack && bun link

# 3. Use it in your Nuxt app
cd your-nuxt-app && bun link nuxt-bun-compile

# 4. Add to nuxt.config.ts modules array
bun nuxt add nuxt-bun-compile

# 5. Build
NODE_OPTIONS="--max-old-space-size=8192" bun run -b build

# 6. Run the binary
./nuxtbin
```
