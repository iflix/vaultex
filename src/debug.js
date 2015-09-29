export default function () {
  this.debug = {}

  this.debug.readRaw = (path, callback) => {
    this.req('GET', `sys/raw/${path}`, null, callback)
  }

  this.debug.updateRaw = (path, value, callback) => {
    this.req('PUT', `sys/raw/${path}`, {
      value
    }, callback)
  }

  this.debug.deleteRaw = (path, callback) => {
    this.req('DELETE', `sys/raw/${path}`, null, callback)
  }

  this.debug.healthcheck = (standbyok, callback) => {
    if (!callback && typeof standbyok === 'function') {
      callback = standbyok
      standbyok = null
    }

    this.req('GET', 'sys/health', {
      standbyok
    }, callback)
  }
}
