/*global describe, before, it*/
import assert from 'assert'

import spawnDevVault from 'spawn-dev-vault'

import Vaultex from '../src/vaultex'

let vaultConfig

function hostStrToObj () {
  return {
    host: vaultConfig.address.match(/\/\/(.+):/)[1],
    port: vaultConfig.address.match(/:(\d+)$/)[1]
  }
}

describe('Vaultex', function () {
  before(function (done) {
    this.timeout(100000)
    spawnDevVault.download(process.cwd(), function (err) {
      assert.ifError(err)
      spawnDevVault(null, function (err, data) {
        if (err) {
          assert.ifError(err)
        }
        vaultConfig = data
        done()
      })
    })
  })
  it('should export fn', function () {
    assert.equal(typeof Vaultex, 'function')
  })
  it('should set defaults for opts', function () {
    let vaultex = new Vaultex()
    assert.equal(vaultex.host, '127.0.0.1')
    assert.equal(vaultex.port, 8500)
    assert.equal(vaultex.version, 'v1')
    assert.equal(vaultex.secure, true)
  })
  describe('init', function () {
    describe('initialized', function () {
      it('should return x for existing vault', function (done) {
        let { host, port } = hostStrToObj()
        let vaultex = new Vaultex({
          host,
          port,
          secure: false,
          token: vaultConfig.token
        })
        vaultex.init.initialized(function (err, data) {
          assert.ifError(err)
          assert.equal(data.initialized, true)
          return done()
        })
      })
    })
  })
})
