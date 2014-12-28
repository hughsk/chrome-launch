require('leaked-handles')

const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const http   = require('http')
const path   = require('path')
const test   = require('tape')
const launch = require('./')
const fs     = require('fs')

test('chrome-launch', function(t) {
  var server = http.createServer()
  var chrome = null
  var count  = 0

  t.plan(4)
  server.on('request', function(req, res) {
    t.pass('url hit: ' + req.url)
    res.end()
    if (++count < 2) return

    t.pass('closing server')
    chrome.kill()
    server.close()
  }).listen(function(err) {
    if (err) return t.ifError(err)

    chrome = launch('http://localhost:'+server.address().port)
    chrome.once('close', function() {
      t.pass('close event fired')
    })
  })
})

test('chrome-launch: opts.tmp', function(t) {
  var tmp    = path.resolve(__dirname, '.tmpdir')
  var server = http.createServer()
  var chrome = null
  var count  = 0

  t.plan(6)
  mkdirp.sync(tmp)
  server.listen(function(err) {
    if (err) return t.ifError(err)

    chrome = launch('http://localhost:'+server.address().port, {
      tmp: tmp
    })

    chrome.once('close', function() {
      t.pass('close event fired')

      setTimeout(function() {
        t.ok(fs.existsSync(tmp), 'tmp directory still exists')
        rimraf.sync(tmp)
        t.pass('removed directory successfully')
      }, 100)
    })
  })

  server.on('request', function(req, res) {
    t.pass('url hit: ' + req.url)
    res.end()
    if (++count < 2) return

    t.pass('closing server')
    chrome.kill()
    server.close()
  })
})
