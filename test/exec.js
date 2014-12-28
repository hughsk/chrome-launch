var ps = require('../')('http://google.com', {
    dir: process.argv[2]
  , nuke: true
})

process.stdout.write(String(ps.pid))

setTimeout(function() {
  process.exit()
}, 100)
