export default function () {
  this.auth.userpass = (username, password, callback, mountPoint = 'userpass') => {
    this.req('POST', `auth/${mountPoint}/login/${username}`, {
      password
    }, callback)
  }
}
