require('leaked-handles')

const exec    = require('child_process').exec
const quote   = require('shell-quote').quote
const running = require('is-running')
const mkdirp  = require('mkdirp')
const rimraf  = require('rimraf')
const http    = require('http')
const path    = require('path')
const test    = require('tape')
const launch  = require('../')
const fs      = require('fs')

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

test('chrome-launch: process.exit', function(t) {
  var tmp = path.join(__dirname, '.tmpdir')
  var cmd = quote([
      process.execPath
    , path.join(__dirname, 'exec.js')
    , tmp
  ])

  exec(cmd, function(err, pid) {
    if (err) return t.ifError(err)

    t.ok(!fs.existsSync(tmp))
    running(parseInt(pid, 10), function(err, live) {
      if (err) return t.ifError(err)
      t.ok(!live, 'process has been killed')
      t.end()
    })
  })
})
