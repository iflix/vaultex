export default function () {
  this.mounts = {}

  this.mounts.list = (callback) => {
    this.req('GET', 'sys/mounts', null, callback)
  }

  this.mounts.getConfig = (mountPoint, callback) => {
    this.req('GET', `sys/mounts/${mountPoint}/tune`, null, callback)
  }

  this.mounts.mount = (mountPoint, opts, callback) => {
    if (!opts.type) {
      return callback({
        error: 'type is required'
      })
    }

    this.req('POST', `sys/mounts/${mountPoint}`, opts, callback)
  }

  this.mounts.update = (mountPoint, opts, callback) => {
    this.req('POST', `sys/mounts/${mountPoint}/tune`, opts, callback)
  }

  this.mounts.unmount = (mountPoint, callback) => {
    this.req('DELETE', `sys/mount/${mountPoint}`, null, callback)
  }

  this.mounts.remount = (opts, callback) => {
    this.req('POST', 'sys/remount', opts, callback)
  }
}
