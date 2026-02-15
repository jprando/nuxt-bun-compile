import { defineNuxtModule, useLogger } from "@nuxt/kit";
import type { Nuxt } from "@nuxt/schema";
import type { NitroConfig } from "nitropack/types";
import { execSync } from "node:child_process";

export interface ModuleOptions {
  enabled: boolean;
  outfile: string;
  extraExternals: (string | RegExp)[];
  autoCompile: boolean;
  maxMemory: number;
}

const DEFAULT_EXTERNALS: (string | RegExp)[] = [
  "sharp",
  /^@img\//,
  "css-tree",
  /^css-tree\//,
  "csso",
  /^csso\//,
  "svgo",
  "mdn-data",
  /^mdn-data\//,
];

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-bun-compile",
    configKey: "bunCompile",
  },
  defaults: {
    enabled: true,
    outfile: "nuxtbin",
    extraExternals: [],
    autoCompile: true,
    maxMemory: 8192,
  },
  setup(options: ModuleOptions, nuxt: Nuxt) {
    if (!options.enabled) return;

    const logger = useLogger("nuxt-bun-compile");

    // Configure Nitro for bun compile
    nuxt.hook("nitro:config", (nitroConfig: NitroConfig) => {
      logger.info("Configuring Nitro for bun --compile build");

      nitroConfig.preset = "bun";
      nitroConfig.noExternals = true;
      nitroConfig.inlineDynamicImports = true;
      nitroConfig.serveStatic = "inline";

      nitroConfig.esbuild = nitroConfig.esbuild || {};
      nitroConfig.esbuild.options = nitroConfig.esbuild.options || {};
      nitroConfig.esbuild.options.target = "esnext";

      const allExternals = [...DEFAULT_EXTERNALS, ...options.extraExternals];

      nitroConfig.rollupConfig = nitroConfig.rollupConfig || {};
      const existing = nitroConfig.rollupConfig.external;
      if (Array.isArray(existing)) {
        nitroConfig.rollupConfig.external = [...existing, ...allExternals];
      } else if (existing) {
        nitroConfig.rollupConfig.external = [existing as string | RegExp, ...allExternals];
      } else {
        nitroConfig.rollupConfig.external = allExternals;
      }

      // Auto-compile after Nitro build completes
      if (options.autoCompile) {
        nitroConfig.hooks = nitroConfig.hooks || {};
        nitroConfig.hooks.compiled = () => {
          const isBun = typeof globalThis.Bun !== "undefined"
            || process.versions.bun !== undefined;

          if (!isBun) {
            logger.warn("Bun runtime not detected, skipping --compile step. Run with bun to enable.");
            return;
          }

          const outputPath = ".output/server/index.mjs";
          const cmd = `bun build ${outputPath} --compile --outfile ${options.outfile}`;

          logger.info(`Bun v${process.versions.bun} detected, running --compile step`);
          logger.info(`Compiling binary: ${cmd}`);
          try {
            execSync(cmd, { stdio: "inherit", cwd: nuxt.options.rootDir });
            logger.success(`Binary created: ${options.outfile}`);
          } catch (err) {
            logger.error("bun build --compile failed:", err);
          }
        };
      }
    });
  },
});
