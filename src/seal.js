export default function () {
  this.seal = {}

  this.seal.status = (callback) => {
    this.req('GET', 'sys/seal-status', null, callback)
  }

  this.seal.seal = (callback) => {
    this.req('PUT', 'sys/seal', null, callback)
  }

  this.seal.unseal = (key, callback) => {
    this.req('PUT', 'sys/unseal', {
      key
    }, callback)
  }
}
