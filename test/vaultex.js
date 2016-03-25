/*global describe, before, after, it*/
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
})
