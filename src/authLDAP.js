export default function () {
  this.auth.ldap = (username, password, callback, mountPoint = 'ldap') => {
    this.req('POST', `auth/${mountPoint}/login/${username}`, {
      password
    }, callback)
  }
}
