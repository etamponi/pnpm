import {PnpmOptions, prune} from 'supi-glitch'
import createStoreController from '../createStoreController'

export default async (input: string[], opts: PnpmOptions) => {
  opts['storeController'] = (await createStoreController(opts)).ctrl // tslint:disable-line
  return prune(opts)
}
