import path = require('path')
import fs = require('mz/fs')
import tape = require('tape')
import promisifyTape from 'tape-promise'
import loadJsonFile = require('load-json-file')
import pathExists = require('path-exists')
import {
  prepare,
  execPnpm,
  spawn,
} from './utils'

const test = promisifyTape(tape)

test['only']('installation using pnpm server', async (t: tape.Test) => {
  const project = prepare(t)

  const server = spawn(['server'])

  setTimeout(async () => {
    const serverJsonPath = path.resolve('..', 'store', '2', 'server.json')
    const serverJson = await loadJsonFile(serverJsonPath)
    t.ok(serverJson)
    t.ok(serverJson.connectionOptions)

    await execPnpm('install', 'is-positive')

    process.kill(server.pid, 'SIGTERM')

    t.notOk(await pathExists(serverJsonPath))

    t.ok(project.requireModule('is-positive'))

    t.end()
  }, 2000)
})
