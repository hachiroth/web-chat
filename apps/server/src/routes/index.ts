import type { Router } from 'express'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import url from 'node:url'
import express from 'express'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

export interface RouteInstallerOption {
  prefix?: string
  debug?: boolean
}

/**
 * Auto register routes in dir `routes`. All auto-registered routes must default export the router.
 */
export default (options?: RouteInstallerOption): Router => {
  const { prefix = '', debug = true } = options || {}

  const router = express.Router()
  const dir = __dirname

  const files = fs.readdirSync(dir).filter((file) => {
    const isScript = file.endsWith('.js') || file.endsWith('.ts')
    const name = path.basename(file, path.extname(file))

    if (name.startsWith('index'))
      return false
    if (!isScript)
      return false
    return true
  })

  for (const file of files) {
    const name = path.basename(file, path.extname(file))
    const routePath = path.posix.join(prefix, name)
    const modulePath = path.join(dir, file)
    const module = require(modulePath)

    if (debug) {
      console.debug(`Route installing: ${routePath}`)
    }

    router.use(routePath, module.default)
  }

  return router
}
