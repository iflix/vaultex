/*global describe, before, it*/
import assert from 'assert'

import spawnDevVault from 'spawn-dev-vault'

import Vaultex from '../src/vaultex'

function hostStrToObj (vaultConfig) {
  let {
    address = '//127.0.0.1:8500'
  } = vaultConfig
  return {
    host: address.match(/\/\/(.+):/)[1],
    port: address.match(/:(\d+)$/)[1]
  }
}

function spawnVault (dev, callback) {
  spawnDevVault({
    dev
  }, function (err, data) {
    assert.ifError(err)
    let { host, port } = hostStrToObj(data)
    return callback(data, new Vaultex({
      host,
      port,
      secure: false,
      token: data.token
    }))
  })
}

function killVault (vaultConfig) {
  vaultConfig.process.kill()
}

describe('Vaultex', function () {
  before(function (done) {
    this.timeout(100000)
    spawnDevVault.download(process.cwd(), function (err) {
      assert.ifError(err)
      done()
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
      it('should return true for initd vault', function (done) {
        spawnVault(true, function (vaultConfig, vaultex) {
          vaultex.init.initialized(function (err, data) {
            assert.ifError(err)
            assert.equal(data.initialized, true)
            killVault(vaultConfig)
            return done()
          })
        })
      })
      it('should return false for not initd vault', function (done) {
        spawnVault(false, function (vaultConfig, vaultex) {
          vaultex.init.initialized(function (err, data) {
            assert.ifError(err)
            assert.equal(data.initialized, false)
            killVault(vaultConfig)
            return done()
          })
        })
      })
    })
  })
})
