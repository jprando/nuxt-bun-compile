# Nuxt Bun Compile

## 🎯 O que Faz

O módulo se conecta ao pipeline de build do Nuxt e cuida de **tudo** automaticamente:

1. **Configura o Nitro** com as configurações ótimas para compilação em binário
2. **Externaliza pacotes problemáticos** que quebram com bundling completo
3. **Executa `bun build --compile`** após o build para produzir um executável standalone

### Configuração do Nitro (aplicada automaticamente)

| Configuração | Valor | Motivo |
|---|---|---|
| `preset` | `"bun"` | Usar o runtime Bun como alvo |
| `noExternals` | `true` | Empacotar tudo no output |
| `inlineDynamicImports` | `true` | Achatar imports dinâmicos para output em arquivo único |
| `serveStatic` | `"inline"` | Embutir assets estáticos no binário |
| `esbuild.options.target` | `"esnext"` | Usar as features JS mais recentes para máximo desempenho |
