declare global {
  namespace globalThis {
    // eslint-disable-next-line no-var
    var Bun: typeof import('bun') | undefined
  }
}

export {}
