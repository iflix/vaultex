export default function () {
  this.secret.ssh = {}

  this.secret.ssh.mount = (path = 'ssh', callback) => {
    this.auth.enableBackend(path, {
      type: 'ssh'
    }, callback)
  }

  this.secret.ssh.unmount = (path = 'ssh', callback) => {
    this.auth.disableBackend(path, callback)
  }

  this.secret.ssh.createKey = (name, key, callback, mountPoint) => {
    this.req('POST', `${mountPoint}/keys/${name}`, {
      key
    }, callback)
  }

  this.secret.ssh.deleteKey = (name, callback, mountPoint) => {
    this.req('DELETE', `${mountPoint}/keys/${name}`, null, callback)
  }

  this.secret.ssh.createRole = (role, opts, callback, mountPoint) => {
    [ 'default_user', 'key_type' ].forEach((k) => {
      if (!opts[k]) {
        return callback({
          error: `${k} is required`
        })
      }
    })

    if (opts.key_type === 'dynamic') {
      [ 'admin_user', 'key' ].forEach((k) => {
        if (!opts[k]) {
          return callback({
            error: `${k} is required`
          })
        }
      })
    }

    this.req('POST', `${mountPoint}/roles/${role}`, opts, callback)
  }

  this.secret.ssh.getRole = (role, callback, mountPoint) => {
    this.req('GET', `${mountPoint}/roles/${role}`, null, callback)
  }

  this.secret.ssh.deleteRole = (role, callback, mountPoint) => {
    this.req('DELETE', `${mountPoint}/roles/${role}`, null, callback)
  }

  this.secret.ssh.getCredentials = (role, opts, callback, mountPoint) => {
    if (!opts.ip) {
      return callback({
        error: 'ip is required'
      })
    }

    this.req('POST', `${mountPoint}/creds/${role}`, opts, callback)
  }

  this.secret.ssh.lookup = (ip, callback, mountPoint) => {
    this.req('POST', `${mountPoint}/lookup`, {
      ip
    }, callback)
  }

  this.secret.ssh.verify = (otp, callback, mountPoint) => {
    this.req('POST', `${mountPoint}/lookup`, {
      otp
    }, callback)
  }
}
