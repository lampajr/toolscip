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
* [`clisci init`](#clisci-init)
* [`clisci invoke`](#clisci-invoke)
* [`clisci query`](#clisci-query)
* [`clisci scdl`](#clisci-scdl)
* [`clisci subscribe`](#clisci-subscribe)
* [`clisci unsubscribe`](#clisci-unsubscribe)

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

## `clisci init`

initialize the 'clisci' configuration files, this command MUST be executed in the directory where the user wants to store the project.

```
USAGE
  $ clisci init

OPTIONS
  -h, --help    show init command help
  -s, --server  initialize a simple 'express.js' server for receive asynchronous responses
```

_See code: [dist/commands/init.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/init.ts)_

## `clisci invoke`

invoke a target smart contract's function starting from a smart contract's descriptor.

```
USAGE
  $ clisci invoke

OPTIONS
  -F, --format=format        [default: scdl] descriptor format
  -a, --auth=auth            authorization token
  -c, --contract=contract    (required) contract's name
  -d, --doc=doc              degree of confidence
  -h, --help                 show invoke command help
  -i, --corrId=corrId        client-provided correlation identifier
  -j, --jsonrpc=jsonrpc      (required) jsonrpc request identifier
  -n, --name=name            (required) name of the function to invoke
  -p, --path=path            provide a path where the config files are located, if not set, the current dir is used

  -s, --signature=signature  [default: sha256] cryptographic hash function's name that has to be used to sign the
                             request

  -t, --timeout=timeout      timeout that the gateway have to wait before block the operation

  -u, --callback=callback    callback URL to which the gateway will forward all asynchronous responses

  -v, --val=val              value to be passed as parameter to the function, if more than one value is required you can
                             set this flag multiple times
```

_See code: [dist/commands/invoke.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/invoke.ts)_

## `clisci query`

query past event occurences or function invocations

```
USAGE
  $ clisci query

OPTIONS
  -F, --format=format        [default: scdl] descriptor format
  -a, --auth=auth            authorization token
  -c, --contract=contract    (required) contract's name
  -d, --endTime=endTime      end time from which stop considering event occurrences or function invocations
  -e, --event=event          name of the event to query
  -f, --function=function    name of the function to query
  -h, --help                 show query command help
  -j, --jsonrpc=jsonrpc      (required) jsonrpc request identifier
  -l, --filter=filter        C-style boolean expression over function/event parameters
  -p, --path=path            provide a path where the config files are located, if not set, the current dir is used
  -s, --startTime=startTime  start time from which start considering event occurrences or function invocations

  -v, --val=val              (required) value to be passed as parameter to the function, if more than one value is
                             required you can set this flag multiple times
```

_See code: [dist/commands/query.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/query.ts)_

## `clisci scdl`

gain information about local descriptors, to add new descriptors and to delete already stored descriptors.

```
USAGE
  $ clisci scdl

OPTIONS
  -L, --local            add a new descriptor from a local file path
  -P, --pattern=pattern  set a pattern matching for descriptors to list
  -R, --remote           add a new descriptor from a remote online registry
  -a, --add=add          add a new descriptor
  -d, --delete=delete    delete a local descriptor
  -h, --help             show scdl command help
  -l, --list             list all scdl descriptors
  -p, --path=path        provide a path where the config files are located, if not set, the current dir is used
```

_See code: [dist/commands/scdl.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/scdl.ts)_

## `clisci subscribe`

monitor a target smart contract's function invocations or event occurrences starting from a smart contract's descriptor.

```
USAGE
  $ clisci subscribe

OPTIONS
  -F, --format=format      [default: scdl] descriptor format
  -a, --auth=auth          authorization token
  -c, --contract=contract  (required) contract's name
  -d, --doc=doc            degree of confidence
  -e, --event=event        name of the event to subscribe
  -f, --function=function  name of the function to subscribe
  -h, --help               show subscribe command help
  -i, --corrId=corrId      client-provided correlation identifier
  -j, --jsonrpc=jsonrpc    (required) jsonrpc request identifier
  -p, --path=path          provide a path where the config files are located, if not set, the current dir is used
  -t, --filter=filter      C-style boolean expression over function/event parameters
  -u, --callback=callback  (required) callback URL to which the gateway will forward all asynchronous responses

  -v, --val=val            value to be passed as parameter to the function, if more than one value is required you can
                           set this flag multiple times
```

_See code: [dist/commands/subscribe.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/subscribe.ts)_

## `clisci unsubscribe`

stop live monitoring of a smart contract's function or event by unsubscribing a previous subscription.

```
USAGE
  $ clisci unsubscribe

OPTIONS
  -F, --format=format      [default: scdl] descriptor format
  -a, --auth=auth          authorization token
  -c, --contract=contract  (required) contract's name
  -e, --event=event        name of the event to unsubscribe
  -f, --function=function  name of the function to unsubscribe
  -h, --help               show unsubscribe command help
  -i, --corrId=corrId      client-provided correlation identifier
  -j, --jsonrpc=jsonrpc    (required) jsonrpc request identifier
  -p, --path=path          provide a path where the config files are located, if not set, the current dir is used
```

_See code: [dist/commands/unsubscribe.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/unsubscribe.ts)_
<!-- commandsstop -->
