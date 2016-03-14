export default function () {
  this.audit = {}

  this.audit.list = (callback) => {
    this.req('GET', 'sys/audit', null, callback)
  }

  this.audit.enableBackend = (name, opts, callback) => {
    if (!opts.type) {
      return callback({
        error: 'type is required'
      })
    }

    this.req('PUT', `sys/audit/${name}`, opts, callback)
  }

  this.audit.disableBackend = (name, callback) => {
    this.req('DELETE', `sys/audit/${name}`, null, callback)
  }

  this.audit.hash = (name, input, callback) => {
    this.req('POST', `sys/audit-hash/${name}`, {
      input
    }, callback)
  }
}
