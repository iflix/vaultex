export default function () {
  this.key = {}
  this.rekey = {}

  this.key.status = (callback) => {
    this.req('GET', 'sys/key-status', null, callback)
  }

  this.rekey.status = (callback) => {
    this.req('GET', 'sys/rekey/init', null, callback)
  }

  this.rekey.start = (opts, callback) => {
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

    this.req('PUT', 'sys/rekey/init', opts, callback)
  }

  this.rekey.cancel = (callback) => {
    this.req('DELETE', 'sys/rekey/init', null, callback)
  }

  this.rekey.update = (opts, callback) => {
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

    this.req('PUT', 'sys/rekey/update', opts, callback)
  }

  this.rekey.rotate = (callback) => {
    this.req('PUT', 'sys/rotate', null, callback)
  }
}
