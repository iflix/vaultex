export default function () {
  this.auth.github = {}

  this.auth.github.login = (token, callback, mountPoint = 'github') => {
    this.req('POST', `auth/${mountPoint}/login`, {
      token
    }, callback)
  }

  this.auth.github.setOrganisation = (organization, callback, mountPoint = 'github') => {
    this.req('POST', `auth/${mountPoint}/config`, {
      organization
    }, callback)
  }

  this.auth.github.mapTeam = (team, role, callback, mountPoint = 'github') => {
    this.req('POST', `auth/${mountPoint}/map/teams/${team}`, {
      value: team
    }, callback)
  }
}
