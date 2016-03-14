export default function () {
  this.auth.appID = (appId, userId, callback, mountPoint = 'app-id') => {
    this.req('POST', `auth/${mountPoint}/login`, {
      app_id: appId,
      user_id: userId
    }, callback)
  }
}
