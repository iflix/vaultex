export default function () {
  this.secret.aws = {}

  this.secret.aws.mount = (path = 'aws', callback) => {
    this.auth.enableBackend(path, {
      type: 'aws'
    }, callback)
  }

  this.secret.aws.unmount = (path = 'aws', callback) => {
    this.auth.disableBackend(path, callback)
  }

  this.secret.aws.setCredentials = (accessKey, secretKey, region, callback, mountPoint) => {
    this.req('POST', `${mountPoint}/config/root`, {
      access_key: accessKey,
      secret_key: secretKey,
      region
    }, callback)
  }

  this.secret.aws.setLease = (lease, leaseMax, callback, mountPoint) => {
    this.req('POST', `${mountPoint}/config/lease`, {
      lease,
      lease_max: leaseMax
    }, callback)
  }

  this.secret.aws.createRole = (name, policy, callback, mountPoint) => {
    this.req('POST', `${mountPoint}/roles/${name}`, {
      policy
    }, callback)
  }

  this.secret.aws.getRole = (name, callback, mountPoint) => {
    this.req('GET', `${mountPoint}/roles/${name}`, null, callback)
  }

  this.secret.aws.deleteRole = (name, callback, mountPoint) => {
    this.req('DELETE', `${mountPoint}/roles/${name}`, null, callback)
  }

  this.secret.aws.getCredentials = (name, callback, mountPoint) => {
    this.req('GET', `${mountPoint}/creds/${name}`, null, callback)
  }
}
