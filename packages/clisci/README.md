clisci
======

Command Line Interface for Smart Contracts interaction

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/clisci.svg)](https://npmjs.org/package/clisci)
[![Downloads/week](https://img.shields.io/npm/dw/clisci.svg)](https://npmjs.org/package/clisci)
[![License](https://img.shields.io/npm/l/clisci.svg)](https://github.com/lampajr/toolscip/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @lampajr/clisci
$ clisci COMMAND
running command...
$ clisci (-v|--version|version)
@lampajr/clisci/1.0.0 linux-x64 node-v10.16.3
$ clisci --help [COMMAND]
USAGE
  $ clisci COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`clisci hello [FILE]`](#clisci-hello-file)
* [`clisci help [COMMAND]`](#clisci-help-command)
* [`clisci init [FILE]`](#clisci-init-file)
* [`clisci scdl [FILE]`](#clisci-scdl-file)


## `clisci hello [FILE]`

describe the command here

```
USAGE
  $ clisci hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ clisci hello
  hello world from ./src/hello.ts!
```

_See code: [dist/commands/hello.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/hello.ts)_

## `clisci help [COMMAND]`

display help for clisci

```
USAGE
  $ clisci help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.2/src/commands/help.ts)_

## `clisci init [FILE]`

Initialize the 'clisci' command line tool.

```
USAGE
  $ clisci init [FILE]

OPTIONS
  -g, --global  Initialize the folder in the user's home directory.
  -h, --help    show CLI help
```

_See code: [dist/commands/init.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/init.ts)_

## `clisci scdl [FILE]`

describe the command here

```
USAGE
  $ clisci scdl [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```
<!-- commandsstop -->
