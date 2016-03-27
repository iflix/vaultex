/*global describe, it*/
import assert from 'assert'

import {
  spawnVault
} from './_utils'

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
