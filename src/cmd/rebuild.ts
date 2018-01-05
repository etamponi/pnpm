import path = require('path')
import {
  PnpmOptions,
  rebuild,
  rebuildPkgs,
} from 'supi-glitch'

export default async function (
  args: string[],
  opts: PnpmOptions,
  command: string,
) {
  if (args.length === 0) {
    await rebuild(opts)
  }
  await rebuildPkgs(args, opts)
}
