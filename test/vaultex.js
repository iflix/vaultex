/*global describe, before, after, it, xit*/
import assert from 'assert'

import spawnDevVault from 'spawn-dev-vault'

import {
  spawnVault
} from './_utils'

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
            sharedVaultex.secret.generic.writeRaw('key', {
              value: 'hello'
            }, function (err) {
              assert.ifError(err)
              done()
            })
          })
        })

        describe('readRaw', function () {
          it('should read raw value', function (done) {
            sharedVaultex.secret.generic.readRaw('key', function (err, response) {
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
  })
  describe('HA', function () {
    describe('getLeader', function () {
      it('should return leader details', function (done) {
        spawnVault(true, function (vaultex) {
          vaultex.ha.getLeader(function (err, leader) {
            assert.ifError(err)

            assert.deepEqual(leader, {
              ha_enabled: false,
              is_self: false,
              leader_address: ''
            })

            vaultex.kill(done)
          })
        })
      })
    })
  })
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
})
