# Nuxt Bun Compile

## 📝 Notas

### Por que `NODE_OPTIONS="--max-old-space-size=8192"`?

O processo de build do Nuxt com `noExternals: true` e `inlineDynamicImports: true` faz com que o Rollup/esbuild tente empacotar **todas** as dependências em um único bundle. Em projetos com muitas dependências, isso pode consumir mais memória do que o limite padrão do V8 (aproximadamente 1.5–2 GB), causando o erro:

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

A variável `NODE_OPTIONS="--max-old-space-size=8192"` aumenta o limite de memória heap do V8 para 8 GB, dando margem suficiente para que o bundling termine sem estourar a memória. O valor de `8192` (MB) é uma referência segura para a maioria dos projetos — ajuste conforme necessário para projetos maiores ou máquinas com menos RAM.

> **Nota:** Essa variável afeta o processo do Node.js/V8 que roda o build do Nuxt, e não o binário final gerado pelo `bun build --compile`.
