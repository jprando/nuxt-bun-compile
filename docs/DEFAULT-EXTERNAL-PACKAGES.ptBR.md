# Nuxt Bun Compile

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
