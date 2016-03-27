/*global describe, it*/
import assert from 'assert'

import {
  spawnVault
} from './_utils'

describe('init', function () {
  describe('initialized', function () {
    it('should return true for initd vault', function (done) {
      spawnVault(true, function (vaultex) {
        vaultex.init.initialized(function (err, data) {
          assert.ifError(err)
          assert.equal(data.initialized, true)

          vaultex.kill(done)
        })
      })
    })

    it('should return false for not initd vault', function (done) {
      spawnVault(false, function (vaultex) {
        vaultex.init.initialized(function (err, data) {
          assert.ifError(err)
          assert.equal(data.initialized, false)

          vaultex.kill(done)
        })
      })
    })
  })

  describe('initialize', function () {
    it('should require opts', function (done) {
      spawnVault(false, function (vaultex) {
        vaultex.init.initialize({}, function (err) {
          assert.equal(err.error, 'secret_shares is required')

          vaultex.init.initialize({
            secret_shares: 1
          }, function (err) {
            assert.equal(err.error, 'secret_threshold is required')
            vaultex.kill(done)
          })
        })
      })
    })

    it('should initialize vault', function (done) {
      spawnVault(false, function (vaultex, vaultConfig) {
        vaultex.init.initialize({
          secret_shares: 5,
          secret_threshold: 5
        }, function (err, data) {
          assert.ifError(err)

          vaultex.kill(done)
        })
      })
    })
  })
})
