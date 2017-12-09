import {connectStoreController} from '@pnpm/server'
import loadJsonFile = require('load-json-file')
import path = require('path')
import {install, installPkgs, PnpmOptions} from 'supi'
import extendOptions from 'supi/lib/api/extendOptions'
import requireHooks from '../requireHooks'

/**
 * Perform installation.
 * @example
 *     installCmd([ 'lodash', 'foo' ], { silent: true })
 */
export default async function installCmd (input: string[], opts: PnpmOptions) {
  // `pnpm install ""` is going to be just `pnpm install`
  input = input.filter(Boolean)

  const prefix = opts.prefix || process.cwd()
  opts.hooks = requireHooks(prefix)

  try {
    // Only the store path is needed here
    const strictOpts = await extendOptions(opts)
    const serverJson = await loadJsonFile(path.join(strictOpts.store, 'server.json'))
    // TODO: log something: console.log('Using server', serverConnectionInfo)
    opts['storeController'] = await connectStoreController(serverJson.connectionOptions) // tslint:disable-line
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }

  if (!input || !input.length) {
    return install(opts)
  }
  return installPkgs(input, opts)
}
