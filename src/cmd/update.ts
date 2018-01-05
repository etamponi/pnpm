import {install, installPkgs, PnpmOptions} from 'supi-glitch'
import createStoreController from '../createStoreController'
import requireHooks from '../requireHooks'

export default async function (input: string[], opts: PnpmOptions) {
  opts = Object.assign({update: true}, opts)

  const prefix = opts.prefix || process.cwd()
  if (!opts.ignorePnpmfile) {
    opts.hooks = requireHooks(prefix)
  }
  opts['storeController'] = (await createStoreController(opts)).ctrl // tslint:disable-line

  if (!input || !input.length) {
    return install(opts)
  }
  return installPkgs(input, opts)
}
