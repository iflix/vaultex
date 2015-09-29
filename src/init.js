export default function () {
  this.init = {}

  this.init.initialized = (callback) => {
    this.req('GET', 'sys/init', null, callback)
  }

  this.init.initialize = (opts, callback) => {
    if (!opts.secret_shares) {
      return callback({
        error: 'secret_shares is required'
      })
    }

    if (!opts.secret_threshold) {
      return callback({
        error: 'secret_threshold is required'
      })
    }

    if (opts.pgp_keys !== undefined && !Array.isArray(opts.pgp_keys)) {
      return callback({
        error: 'pgp_keys must be an array'
      })
    }

    this.req('PUT', 'sys/init', opts, callback)
  }

  this.init.getGenerateRootAttempt = (callback) => {
    this.req('GET', 'sys/generate-root/attempt', null, callback)
  }

  this.init.startGenerateRootAttempt = (opts, callback) => {
    if (typeof opts === 'function') {
      callback = opts
      opts = {}
    }

    this.req('PUT', 'sys/generate-root/attempt', opts, callback)
  }

  this.init.cancelGenerateRootAttempt = (callback) => {
    this.req('DELETE', 'sys/generate-root/attempt', null, callback)
  }

  this.init.updateGenerateRootAttempt = (opts, callback) => {
    if (!opts.key) {
      return callback({
        error: 'key is required'
      })
    }

    if (!opts.nonce) {
      return callback({
        error: 'nonce is required'
      })
    }

    this.req('PUT', 'sys/generate-root/update', opts, callback)
  }
}
