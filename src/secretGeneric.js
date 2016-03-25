export default function () {
  this.secret.generic = {}

  this.secret.generic.readRaw = (path, callback, mountPoint = 'secret') => {
    this.req('GET', `${mountPoint}/${path}`, null, callback)
  }

  this.secret.generic.writeRaw = (path, data, callback, mountPoint = 'secret') => {
    this.req('POST', `${mountPoint}/${path}`, data, callback)
  }

  this.secret.generic.write = (key, data, callback, mountPoint) => {
    if (typeof data !== 'object') {
      data = { $vaultex: data }
    }
    this.secret.generic.writeRaw(key, data, function (err, response) {
      if (err) return callback(err)
      if (response && response.error) return callback(response.error)
      return callback()
    }, mountPoint)
  }

  this.secret.generic.read = (key, callback, mountPoint) => {
    this.secret.generic.readRaw(key, function (err, response) {
      if (err) return callback(err)
      if (response.error) return callback(response.error)
      if (!response || !response.data) return callback(null, null)
      const keys = Object.keys(response.data)
      if (keys.length === 1 && keys[0] === '$vaultex') response.data = response.data.$vaultex
      try {
        response.data = JSON.parse(response.data)
      } catch (e) {}
      return callback(null, response.data)
    }, mountPoint)
  }
}
