export default function () {
  this.auth.token = {}

  this.auth.token.create = (opts, callback, mountPoint = 'auth') => {
    this.req('POST', `auth/${mountPoint}/token/create`, opts, callback)
  }

  this.auth.token.lookup = (token, callback, mountPoint = 'auth') => {
    this.req('GET', `auth/${mountPoint}/token/lookup/${token}`, null, callback)
  }

  this.auth.token.lookupSelf = (callback, mountPoint = 'auth') => {
    this.req('GET', `auth/${mountPoint}/token/lookup-self`, null, callback)
  }

  this.auth.token.revoke = (token, callback, mountPoint = 'auth') => {
    this.req('POST', `auth/${mountPoint}/token/revoke/${token}`, null, callback)
  }

  this.auth.token.revokeSelf = (callback, mountPoint = 'auth') => {
    this.req('POST', `auth/${mountPoint}/token/revoke-self`, null, callback)
  }

  this.auth.token.revokeOrphan = (token, callback, mountPoint = 'auth') => {
    this.req('POST', `auth/${mountPoint}/token/revoke-orphan/${token}`, null, callback)
  }

  this.auth.token.revokePrefix = (path, callback, mountPoint = 'auth') => {
    this.req('POST', `auth/${mountPoint}/token/revoke-prefix/${path}`, null, callback)
  }

  this.auth.token.renew = (token, opts, callback, mountPoint = 'auth') => {
    this.req('POST', `auth/${mountPoint}/token/renew/${token}`, opts, callback)
  }
}
