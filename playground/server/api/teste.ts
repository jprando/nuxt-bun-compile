// Intentionally using 'node:' prefix to test if Bun runtime can properly handle
// Node.js standard library modules when the binary is generated via bun build --compile
import { setTimeout } from 'node:timers/promises'

const oneAndHalfSeconds = 1_500

export default defineEventHandler(async (_event) => {
  await setTimeout(oneAndHalfSeconds)
  return {
    datetimeOnServer: new Date(),
  }
})
