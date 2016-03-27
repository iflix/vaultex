/*global describe, before, after, it*/
import assert from 'assert'

import {
  spawnVault
} from '../_utils'

describe('secret backends', function () {
  describe('generic', function () {
    let sharedVaultex = null

    before(function (done) {
      spawnVault(true, function (vaultex) {
        sharedVaultex = vaultex
        done()
      })
    })

    after(function (done) {
      sharedVaultex.kill(done)
    })

    describe('writeRaw', function () {
      it('should write raw value', function (done) {
        sharedVaultex.secret.generic.writeRaw('rawTest1', {
          value: 'hello'
        }, function (err) {
          assert.ifError(err)
          done()
        })
      })
    })

    describe('readRaw', function () {
      it('should read raw value', function (done) {
        sharedVaultex.secret.generic.readRaw('rawTest1', function (err, response) {
          assert.ifError(err)

          assert.deepEqual(response.data, {
            value: 'hello'
          })

          done()
        })
      })
    })

    describe('write', function () {
      it('should write value and wrap in $vaultex', function (done) {
        sharedVaultex.secret.generic.write('writeTest1', 'hello', function (err) {
          assert.ifError(err)

          sharedVaultex.secret.generic.readRaw('writeTest1', function (err, response) {
            assert.ifError(err)

            assert.deepEqual(response.data, {
              $vaultex: 'hello'
            })

            done()
          })
        })
      })

      it('should be able to write complex objects', function (done) {
        let obj = {
          hello: [ 'world', {
            blah: 'ok'
          } ]
        }

        sharedVaultex.secret.generic.write('writeTest2', obj, function (err) {
          assert.ifError(err)

          sharedVaultex.secret.generic.readRaw('writeTest2', function (err, response) {
            assert.ifError(err)

            assert.deepEqual(response.data, {
              $vaultex: obj
            })
          })

          done()
        })
      })
    })

    describe('read', function () {
      it('should read value', function (done) {
        let value = {
          data: 'hello world123'
        }

        sharedVaultex.secret.generic.writeRaw('readTest1', value, function (err) {
          assert.ifError(err)

          sharedVaultex.secret.generic.read('readTest1', function (err, response) {
            assert.ifError(err)

            assert.deepEqual(response, value)

            done()
          })
        })
      })

      it('should return null if key doesn\'t exist', function (done) {
        sharedVaultex.secret.generic.read('$invalidkey', function (err, value) {
          assert.ifError(err)

          assert.strictEqual(value, null)

          done()
        })
      })

      it('should return value of $vaultex key if exists', function (done) {
        let value = {
          hello: 'world'
        }

        sharedVaultex.secret.generic.writeRaw('readTest2', {
          $vaultex: value
        }, function (err) {
          assert.ifError(err)

          sharedVaultex.secret.generic.read('readTest2', function (err, response) {
            assert.ifError(err)

            assert.deepEqual(response, value)

            done()
          })
        })
      })

      it('should parse value as JSON if possible', function (done) {
        let value = JSON.stringify({
          hello: 'world2'
        })

        sharedVaultex.secret.generic.writeRaw('readTest3', {
          $vaultex: value
        }, function (err) {
          assert.ifError(err)

          sharedVaultex.secret.generic.read('readTest3', function (err, response) {
            assert.ifError(err)

            assert.deepEqual(response, JSON.parse(value))

            done()
          })
        })
      })
    })
  })
})
