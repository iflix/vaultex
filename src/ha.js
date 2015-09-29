export default function () {
  this.ha = {}

  this.ha.getLeader = (callback) => {
    this.req('GET', 'sys/leader', null, callback)
  }
}
