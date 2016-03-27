/*global describe, before, it*/
import assert from 'assert'

import spawnDevVault from 'spawn-dev-vault'

import Vaultex from '../src/vaultex'

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
})
