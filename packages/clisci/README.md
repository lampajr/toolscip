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
* [`clisci help [COMMAND]`](#clisci-help-command)
* [`clisci init [FILE]`](#clisci-init-file)
* [`clisci invoke`](#clisci-invoke)
* [`clisci scdl [FILE]`](#clisci-scdl-file)

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

Initialize the 'clisci' configuration files in the current directory.

```
USAGE
  $ clisci init [FILE]

OPTIONS
  -h, --help    show CLI help
  -s, --server  Initialize a simple 'express.js' server for receive asynchronous responses
```

_See code: [dist/commands/init.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/init.ts)_

## `clisci invoke`

this command invoke a target smart contract's function

```
USAGE
  $ clisci invoke

OPTIONS
  -F, --format=format      [default: scdl] descriptor format
  -a, --auth=auth          authorization token
  -c, --contract=contract  (required) contract's name
  -d, --doc=doc            degree of confidence
  -f, --function=function  (required) name of the function to invoke
  -h, --help               show CLI help
  -i, --corrId=corrId      client-provided correlation identifier
  -j, --jsonrpc=jsonrpc    (required) jsonrpc request identifier
  -p, --path=path          provide a path where the config files are located, if not set, the current dir is used
  -t, --timeout=timeout    timeout that the gateway have to wait before block the operation
  -u, --callback=callback  callback URL to which the gateway will forward all asynchronous responses

  -v, --val=val            value to be passed as parameter to the function, if more than one value is required you can
                           set this flag multiple times
```

_See code: [dist/commands/invoke.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/invoke.ts)_

## `clisci scdl [FILE]`

describe the command here

```
USAGE
  $ clisci scdl [FILE]

OPTIONS
  -L, --local            add a new descriptor from a local file path
  -P, --pattern=pattern  set a pattern matching for descriptors to list
  -R, --remote           add a new descriptor from a remote online registry
  -a, --add=add          add a new descriptor
  -d, --delete=delete    delete a local descriptor
  -h, --help             show CLI help
  -l, --list             list all scdl descriptors
  -p, --path=path        provide a path where the config files are located, if not set, the current dir is used
```

_See code: [dist/commands/scdl.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/scdl.ts)_
<!-- commandsstop -->
