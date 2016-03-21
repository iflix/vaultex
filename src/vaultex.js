import request from 'request'

import init from './init'
import seal from './seal'
import mounts from './mounts'
import auth from './auth'
import audit from './audit'
import leases from './leases'
import ha from './ha'
import keys from './keys'
import debug from './debug'

import authToken from './authToken'
import authAppID from './authAppID'
import authGithub from './authGithub'
import authUserPass from './authUserPass'
import authLDAP from './authLDAP'

import secretGeneric from './secretGeneric'
import secretAWS from './secretAWS'
import secretSSH from './secretSSH'

const unauthEndpoints = [
  /sys\/init/
]

class Vaultex {

  constructor (opts = {}) {
    let {
      host = '127.0.0.1',
      port = 8500,
      version = 'v1',
      secure = true,
      token,
      ca
    } = opts

    this.host = host
    this.port = port
    this.version = version
    this.secure = secure
    this.token = token
    this.ca = ca

    this.auth = {}
    this.secret = {}

    init.call(this)
    seal.call(this)
    mounts.call(this)
    audit.call(this)
    leases.call(this)
    ha.call(this)
    keys.call(this)
    debug.call(this)
    auth.call(this)
    authToken.call(this)
    authAppID.call(this)
    authGithub.call(this)
    authUserPass.call(this)
    authLDAP.call(this)
    secretGeneric.call(this)
    secretAWS.call(this)
    secretSSH.call(this)
  }

  req (method, endpoint, body, callback) {
    const isAuthReq = /^auth\//.test(endpoint)
    const isUnauthed = unauthEndpoints.some((e) => e.test(endpoint))

    if (!this.token && !isAuthReq && !isUnauthed) {
      return callback({
        error: 'no token'
      })
    }

    const url = `http${this.secure ? 's' : ''}://${this.host}:${this.port}/${this.version}/${endpoint}`

    const headers = {
      'X-Vault-Token': this.token
    }

    let req = {
      url,
      body,
      method,
      headers,
      json: true
    }

    if (this.ca) {
      req.ca = this.ca
    }

    request(req, (err, data, body) => {
      if (err) {
        return callback(err)
      }
      if (!callback) return
      if (!body) return callback()
      if (isAuthReq) {
        if (body.auth && body.auth.client_token) {
          this.token = body.auth.client_token
        }
      }
      return callback(null, body)
    })
  }

}

export default Vaultex
