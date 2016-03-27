import assert from 'assert'

import spawnDevVault from 'spawn-dev-vault'

import Vaultex from '../src/vaultex'

export function spawnVault (dev, callback) {
  spawnDevVault({
    dev
  }, function (err, data) {
    assert.ifError(err)

    let { host, port } = hostStrToObj(data)
    let vaultex = new Vaultex({
      host,
      port,
      secure: false,
      token: data.token
    })

    vaultex.kill = function (cb) {
      data.process.on('exit', function () {
        cb()
      })
      data.process.kill('SIGKILL')
    }

    setTimeout(function () {
      return callback(vaultex, data)
    }, 200)
  })
}

export function hostStrToObj (vaultConfig) {
  let {
    address = '//127.0.0.1:8500'
  } = vaultConfig

  return {
    host: address.match(/\/\/(.+):/)[1],
    port: address.match(/:(\d+)$/)[1]
  }
}
