export default function () {
  this.auth.listBackends = (callback) => {
    this.req('GET', 'sys/auth', null, callback)
  }

  this.auth.enableBackend = (mountPoint, opts, callback) => {
    if (!opts.type) {
      return callback({
        error: 'type is required'
      })
    }

    this.req('POST', `sys/auth/${mountPoint}`, opts, callback)
  }

  this.auth.deleteBackend = (mountPoint, callback) => {
    this.req('DELETE', `sys/auth/${mountPoint}`, null, callback)
  }

  this.auth.listPolicies = (callback) => {
    this.req('GET', 'sys/policy', null, callback)
  }

  this.auth.getRules = (name, callback) => {
    this.req('GET', `sys/policy/${name}`, null, callback)
  }

  this.auth.addPolicy = this.updatePolicy = (name, rules, callback) => {
    this.req('PUT', `sys/policy/${name}`, {
      rules
    }, callback)
  }

  this.auth.deletePolicy = (name, callback) => {
    this.req('DELETE', `sys/policy/${name}`, null, callback)
  }
}
