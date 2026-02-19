# Nuxt Bun Compile

## ⚙️ Opções

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Habilitar/desabilitar o módulo |
| `outfile` | `string` | `"nuxtbin"` | Nome do arquivo binário de saída |
| `bunPath` | `string` | `undefined` | Caminho para o executável do bun. Pode ser um diretório (ex: `/opt/bun/`) ou o caminho direto para o binário (ex: `/opt/bun/bun`). Se for um diretório, '/bun' será anexado. O padrão é 'bun' do PATH do sistema. |
| `target` | `'bun-linux-x64' \| 'bun-linux-x64-musl' \| 'bun-linux-arm64' \| 'bun-linux-arm64-musl'` | `auto-detectado` | Plataforma alvo para compilação do binário. Auto-detecta sua arquitetura (x64/arm64) e tipo de libc (glibc/musl). Sobrescreva apenas se a auto-detecção falhar ou você precisar de um target específico. |
| `extraExternals` | `(string \| RegExp)[]` | `[]` | Pacotes adicionais para marcar como external |
| `autoCompile` | `boolean` | `true` | Executar `bun build --compile` automaticamente após o build |
