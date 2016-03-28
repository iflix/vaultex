/*global describe, it*/
import assert from 'assert'

import {
  spawnVault
} from './_utils'

describe('Key', function () {
  describe('status', function () {
    it('should return status of current key', function (done) {
      spawnVault(true, function (vaultex) {
        vaultex.key.status(function (err, status) {
          assert.ifError(err)

          assert.notEqual(new Date(status.install_time).toString(), 'Invalid Date')
          assert.equal(status.term, 1)

          vaultex.kill(done)
        })
      })
    })
  })
})

describe('Rekey', function () {
  describe('status', function () {
    it('should return correct status when no rekey', function (done) {
      spawnVault(true, function (vaultex) {
        vaultex.rekey.status(function (err, status) {
          assert.ifError(err)

          assert.deepEqual(status, {
            nonce: '',
            started: false,
            t: 0,
            n: 0,
            progress: 0,
            required: 1,
            pgp_fingerprints: null,
            backup: false
          })

          vaultex.kill(done)
        })
      })
    })
  })
  describe('start', function () {
    it('should start a rekey', function (done) {
      let secret_shares = 10
      let secret_threshold = 6
      spawnVault(true, function (vaultex) {
        vaultex.rekey.status(function (err, status) {
          assert.ifError(err)

          assert.equal(status.started, false)

          vaultex.rekey.start({
            secret_shares,
            secret_threshold
          }, function (err, status) {
            assert.ifError(err)
            assert.equal(status.started, true)
            assert.equal(status.n, secret_shares)
            assert.equal(status.t, secret_threshold)
            vaultex.kill(done)
          })
        })
      })
    })
  })
  describe('cancel', function () {
    it('should stop a rekey', function (done) {
      spawnVault(true, function (vaultex) {
        vaultex.rekey.start({
          secret_shares: 10,
          secret_threshold: 6
        }, function (err, status) {
          assert.ifError(err)
          assert.equal(status.started, true)
          vaultex.rekey.cancel(function (err) {
            assert.ifError(err)
            vaultex.rekey.status(function (err, status) {
              assert.ifError(err)
              assert.equal(status.started, false)
              vaultex.kill(done)
            })
          })
        })
      })
    })
  })
  describe('update', function () {
    it('should update a rekey', function (done) {
      spawnVault(false, function (vaultex) {
        vaultex.init.initialize({
          secret_shares: 1,
          secret_threshold: 1
        }, function (err, data) {
          assert.ifError(err)
          vaultex.token = data.root_token
          vaultex.seal.unseal(data.keys[0], function (err) {
            assert.ifError(err)
            vaultex.rekey.start({
              secret_shares: 2,
              secret_threshold: 2
            }, function (err, status) {
              assert.ifError(err)
              assert.equal(status.started, true)
              vaultex.rekey.update({
                key: data.keys[0],
                nonce: status.nonce
              }, function (err) {
                assert.ifError(err)
                vaultex.rekey.status(function (err, status) {
                  assert.ifError(err)
                  assert.equal(status.started, false)
                  vaultex.kill(done)
                })
              })
            })
          })
        })
      })
    })
    it('should complete a rekey', function (done) {
      spawnVault(true, function (vaultex, vaultexData) {
        let secret_shares = 5
        vaultex.rekey.start({
          secret_shares: secret_shares,
          secret_threshold: 2
        }, function (err, status) {
          assert.ifError(err)
          vaultex.rekey.update({
            key: vaultexData.key,
            nonce: status.nonce
          }, function (err, status) {
            assert.ifError(err)
            assert.equal(status.complete, true)
            assert.equal(status.keys.length, secret_shares)
            vaultex.kill(done)
          })
        })
      })
    })
  })
})
