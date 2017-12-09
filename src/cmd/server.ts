import createFetcher from '@pnpm/default-fetcher'
import createResolver from '@pnpm/default-resolver'
import {createServer} from '@pnpm/server'
import fs = require('graceful-fs')
import mkdirp = require('mkdirp-promise')
import createStore from 'package-store'
import path = require('path')
import { PnpmOptions } from 'supi'
import extendOptions from 'supi/lib/api/extendOptions'
import writeJsonFile = require('write-json-file')

export default async (input: string[], opts: PnpmOptions) => {
  const strictOpts = await extendOptions(opts)

  const resolve = createResolver(strictOpts)
  const fetchers = createFetcher(strictOpts)
  const storeCtrl = await createStore(resolve, fetchers as {}, {
    lockStaleDuration: strictOpts.lockStaleDuration,
    locks: strictOpts.locks,
    networkConcurrency: strictOpts.networkConcurrency,
    store: strictOpts.store,
  })
  const ipcConnectionPath = createIpcConnectionPath(strictOpts.store)
  await mkdirp(path.dirname(ipcConnectionPath))
  const connectionOptions = {
    path: ipcConnectionPath,
  }
  const serverJsonPath = path.join(strictOpts.store, 'server.json')
  await writeJsonFile(serverJsonPath, {connectionOptions})
  const server = createServer(storeCtrl, connectionOptions)

  process.on('exit', () => {
    server.close()
    fs.unlinkSync(serverJsonPath)
  })
}

function createIpcConnectionPath (fsPath: string) {
  fsPath = path.normalize(fsPath) + path.sep + 'socket'
  if (process.platform === 'win32') {
    return `\\\\.\\pipe\\${fsPath}`
  }
  return fsPath
}
