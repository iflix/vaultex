/*global describe, before, after, it, xit*/
import assert from 'assert'

import {
  spawnVault
} from './_utils'

describe('Seal', function () {
  let sharedVaultex = null

  before(function (done) {
    spawnVault(true, function (vaultex, vaultData) {
      sharedVaultex = vaultex
      sharedVaultex.vaultData = vaultData
      done()
    })
  })

  after(function (done) {
    sharedVaultex.kill(done)
  })

  describe('status', function () {
    it('should get status of vault seal', function (done) {
      sharedVaultex.seal.status(function (err, status) {
        assert.ifError(err)

        assert.deepEqual(status, {
          sealed: false,
          t: 1,
          n: 1,
          progress: 0
        })

        done()
      })
    })
  })

  describe('seal', function () {
    it('should seal vault', function (done) {
      sharedVaultex.seal.seal(function (err) {
        assert.ifError(err)

        sharedVaultex.seal.status(function (err, status) {
          assert.ifError(err)

          assert.deepEqual(status, {
            sealed: true,
            t: 1,
            n: 1,
            progress: 0
          })

          done()
        })
      })
    })
  })

  describe('unseal', function () {
    it('should unseal vault', function (done) {
      sharedVaultex.seal.unseal(sharedVaultex.vaultData.key, function (err) {
        assert.ifError(err)

        sharedVaultex.seal.status(function (err, status) {
          assert.ifError(err)

          assert.deepEqual(status, {
            sealed: false,
            t: 1,
            n: 1,
            progress: 0
          })

          done()
        })
      })
    })
    xit('should partially unseal vault when required keys n > 1')
  })
})
