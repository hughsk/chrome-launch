# chrome-launch
![](http://img.shields.io/badge/stability-experimental-orange.svg?style=flat)
![](http://img.shields.io/npm/v/chrome-launch.svg?style=flat)
![](http://img.shields.io/npm/dm/chrome-launch.svg?style=flat)
![](http://img.shields.io/npm/l/chrome-launch.svg?style=flat)

Light cross-platform launcher for Google Chrome.

## Usage

[![NPM](https://nodei.co/npm/chrome-launch.png)](https://nodei.co/npm/chrome-launch/)

### `process = spawn(url, [options])`

Spawns a new Chrome instance in a separate process using
[`child_process.spawn`](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

Options include:

* `args`: additional command-line arguments to pass to Chrome. See
  [here](http://peter.sh/experiments/chromium-command-line-switches/)
  for a full list.
* `dir`: user configuration directory to use. By default, one will be
  created and then removed when the process is killed.
* `env`: environment variables to use. Defaults to `process.env`.
* `nuke`: remove `opts.dir` when the process exits.

The following command-line options are passed to Chrome in addition
to the ones you supply:

* `--no-first-run`
* `--no-default-browser-check`
* `--disable-translate`
* `--disable-default-apps`
* `--disable-popup-blocking`
* `--disable-zero-browsers-open-for-tests`
* `--user-data-dir=${opts.dir}`

## License

MIT. See [LICENSE.md](http://github.com/hughsk/chrome-launch/blob/master/LICENSE.md) for details.
