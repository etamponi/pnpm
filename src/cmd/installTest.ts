import {PnpmOptions} from 'supi-glitch'
import install from './install'
import runNpm from './runNpm'

export default async function (input: string[], opts: PnpmOptions) {
  await install(input, opts)
  runNpm(['test'])
}
