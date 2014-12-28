const quick  = require('quick-tmp')('chrome-launch')
const spawn  = require('child_process').spawn
const chrome = require('chrome-location')
const copy   = require('shallow-copy')
const rimraf = require('rimraf')

module.exports = launchChrome

function launchChrome(uri, opts) {
  var closed = false

  opts = Array.isArray(opts) ? { args: opts } : opts
  opts = copy(opts || {})

  var tmp  = opts.dir || quick()
  var args = [
      uri
    , '--no-first-run'
    , '--no-default-browser-check'
    , '--disable-translate'
    , '--disable-default-apps'
    , '--disable-popup-blocking'
    , '--disable-zero-browsers-open-for-tests'
    , '--user-data-dir=' + tmp
  ].concat(opts.args || [])

  var ps = spawn(chrome, args, {
    env: opts.env || process.env
  })

  // don't remove tmp dir automatically if
  // supplied a custom one, don't want it getting
  // nuked unknowingly!
  if (!opts.dir || opts.nuke) {
    process.on('exit', onClose)
    process.on('close', onClose)
    ps.on('close', onClose)
  }

  return ps

  function onClose() {
    if (closed) return; closed = true
    ps.kill()
    process.removeListener('exit', onClose)
    process.removeListener('close', onClose)

    try {
      rimraf.sync(tmp)
    } catch(e) {
      rimraf.sync(tmp)
    }
  }
}
