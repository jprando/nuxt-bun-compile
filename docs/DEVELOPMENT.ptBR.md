# Nuxt Bun Compile

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
