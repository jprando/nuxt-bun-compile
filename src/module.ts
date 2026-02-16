import { defineNuxtModule, useLogger } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { NitroConfig } from 'nitropack/types'
import { execSync } from 'node:child_process'
import { statSync } from 'node:fs'
import { join } from 'node:path'

export interface ModuleOptions {
  enabled: boolean
  outfile: string
  extraExternals: (string | RegExp)[]
  autoCompile: boolean
  bunPath?: string
}

const DEFAULT_EXTERNALS: (string | RegExp)[] = [
  'sharp',
  /^@img\//,
  'css-tree',
  /^css-tree\//,
  'csso',
  /^csso\//,
  'svgo',
  'mdn-data',
  /^mdn-data\//,
]

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-bun-compile',
    configKey: 'bunCompile',
  },
  defaults: {
    enabled: true,
    outfile: 'nuxtbin',
    extraExternals: [],
    autoCompile: true,
  },
  setup(options: ModuleOptions, nuxt: Nuxt) {
    if (!options.enabled) return

    const logger = useLogger('nuxt-bun-compile')

    if (nuxt.options._prepare) {
      logger.info('👋 Welcome to nuxt-bun-compile!')
      logger.info('📦 To generate a standalone binary, run: bun run -b build')
      logger.info('🔗 Why -b? https://github.com/jprando/nuxt-bun-compile?tab=readme-ov-file#why-is--b-required')
      return
    }
    // @ts-expect-error - NitroConfig is not yet exported by nitropack, but we need it for type safety. Remove when nitropack exports NitroConfig.
    nuxt.hook('nitro:config', (nitroConfig: NitroConfig) => {
      if (
        globalThis.Bun?.env.TEST
        || globalThis.Bun?.env.VITEST
        || globalThis.Bun?.env.NODE_ENV === 'development'
      ) return

      const isBun = typeof globalThis.Bun !== 'undefined'
        || process.versions.bun !== undefined

      if (!isBun) return

      logger.info('Configuring Nitro for bun compile')

      nitroConfig.preset = 'bun'
      nitroConfig.noExternals = true
      nitroConfig.inlineDynamicImports = true
      nitroConfig.serveStatic = 'inline'

      nitroConfig.esbuild = nitroConfig.esbuild || {}
      nitroConfig.esbuild.options = nitroConfig.esbuild.options || {}
      nitroConfig.esbuild.options.target = 'esnext'

      const allExternals = [...DEFAULT_EXTERNALS, ...options.extraExternals]

      nitroConfig.rollupConfig = nitroConfig.rollupConfig || {}
      const existing = nitroConfig.rollupConfig.external
      if (Array.isArray(existing)) {
        nitroConfig.rollupConfig.external = [...existing, ...allExternals]
      }
      else if (existing) {
        nitroConfig.rollupConfig.external = [existing as string | RegExp, ...allExternals]
      }
      else {
        nitroConfig.rollupConfig.external = allExternals
      }

      if (options.autoCompile) {
        nitroConfig.hooks = nitroConfig.hooks || {}
        nitroConfig.hooks.compiled = () => {
          if (!isBun) {
            logger.warn('Bun runtime not detected, skipping --compile step. Run with bun to enable.')
            logger.info('Try running: bun run -b build')
            logger.info('Read more: https://github.com/jprando/nuxt-bun-compile?tab=readme-ov-file#why-is--b-required')
            return
          }

          const outputPath = '.output/server/index.mjs'
          let bunExecutable = 'bun'
          if (options.bunPath) {
            try {
              const stats = statSync(options.bunPath)
              if (stats.isDirectory()) {
                bunExecutable = join(options.bunPath, 'bun')
              }
              else {
                bunExecutable = options.bunPath
              }
            }
            catch {
              logger.warn(`Could not stat bunPath "${options.bunPath}", assuming it's a direct path.`)
              bunExecutable = options.bunPath
            }
          }

          const cmd = `${bunExecutable} build ${outputPath} --compile --outfile ${options.outfile}`

          logger.info(`Bun v${process.versions.bun} detected, running bun compile step`)
          logger.info(`Compiling binary: ${cmd}`)
          try {
            execSync(cmd, { stdio: 'inherit', cwd: nuxt.options.rootDir })
            logger.success(`Binary created: ${options.outfile}`)
          }
          catch (err) {
            logger.error('bun build --compile failed:', err)
          }
        }
      }
    })
  },
})
