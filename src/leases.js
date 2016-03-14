export default function () {
  this.leases = {}

  this.leases.renew = (id, opts, callback) => {
    this.req('PUT', `sys/renew/${id}`, opts, callback)
  }

  this.leases.revoke = (id, callback) => {
    this.req('PUT', `sys/revoke/${id}`, null, callback)
  }

  this.leases.revokeSelf = (callback) => {
    this.req('PUT', 'sys/revoke-self', null, callback)
  }

  this.leases.revokePrefix = (prefix, callback) => {
    this.req('PUT', `sys/revoke-prefix/${prefix}`, null, callback)
  }
}
