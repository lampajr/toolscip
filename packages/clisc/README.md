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
$ npm install -g @toolscip/clisc
$ clisc COMMAND
running command...
$ clisc (-v|--version|version)
@toolscip/clisc/1.0.0 linux-x64 node-v10.16.3
$ clisc --help [COMMAND]
USAGE
  $ clisc COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`clisc help [COMMAND]`](#clisc-help-command)
* [`clisc init`](#clisc-init)
* [`clisc invoke`](#clisc-invoke)
* [`clisc query`](#clisc-query)
* [`clisc scdl`](#clisc-scdl)
* [`clisc scdl:list [KEYWORD]`](#clisc-scdllist-keyword)
* [`clisc subscribe`](#clisc-subscribe)
* [`clisc unsubscribe`](#clisc-unsubscribe)

## `clisc help [COMMAND]`

display help for clisc

```
USAGE
  $ clisc help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.2/src/commands/help.ts)_

## `clisc init`

initialize the 'clisci' configuration files, this command MUST be executed in the directory where the user wants to store the project.

```
USAGE
  $ clisc init

OPTIONS
  -h, --help    show init command help
  -s, --server  initialize a simple 'express.js' server for receive asynchronous responses
```

_See code: [dist/commands/init.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/init.ts)_

## `clisc invoke`

invoke a target smart contract's function/method starting from a smart contract's descriptor.

```
USAGE
  $ clisc invoke

OPTIONS
  -F, --file=file            path to a JSON file that contains all required parameter for the specific request
  -a, --auth=auth            authorization token
  -c, --contract=contract    (required) name of the contract to interact with
  -d, --doc=doc              degree of confidence's value
  -h, --help                 show invoke command help
  -i, --corrId=corrId        client-provided correlation identifier
  -j, --jsonrpc=jsonrpc      (required) jsonrpc request identifier
  -m, --method=method        (required) name of the request's target function/method

  -p, --path=path            provide a path where the config files are located, if not set, the current directory is
                             used

  -s, --signature=signature  [default: sha256] cryptographic hash function's name that has to be used to sign the
                             request

  -t, --timeout=timeout      timeout that the gateway have to wait before block the operation

  -u, --callback=callback    callback URL to which the gateway will send all asynchronous responses

  -v, --value=value          target function or event parameter's value, if more than one value is required you can set
                             this flag multiple times (the order is important!)
```

_See code: [dist/commands/invoke.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/invoke.ts)_

## `clisc query`

query past event occurences or function invocations

```
USAGE
  $ clisc query

OPTIONS
  -F, --file=file            path to a JSON file that contains all required parameter for the specific request
  -a, --auth=auth            authorization token
  -c, --contract=contract    (required) name of the contract to interact with
  -d, --endTime=endTime      end time from which stop considering event occurrences or function invocations
  -e, --event=event          (required) name of the request's target event
  -f, --filter=filter        C-style boolean expression over function/event parameters
  -h, --help                 show query command help
  -j, --jsonrpc=jsonrpc      (required) jsonrpc request identifier
  -m, --method=method        (required) name of the request's target function/method

  -p, --path=path            provide a path where the config files are located, if not set, the current directory is
                             used

  -s, --startTime=startTime  start time from which start considering event occurrences or function invocations

  -v, --val=val              target function or event parameter's value, if more than one value is required you can set
                             this flag multiple times (the order is important!)
```

_See code: [dist/commands/query.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/query.ts)_

## `clisc scdl`

gain information about local descriptors, to add new descriptors and to delete already stored descriptors.

```
USAGE
  $ clisc scdl

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

## `clisc scdl:list [KEYWORD]`

list saved SCDL smart contract's descriptors

```
USAGE
  $ clisc scdl:list [KEYWORD]

ARGUMENTS
  KEYWORD  keyword search

OPTIONS
  -e, --extended   retrieve ALL saved SCDL descriptors
  -p, --path=path  provide a path where the config files are located, if not set, the current directory is used
```

_See code: [dist/commands/scdl/list.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/scdl/list.ts)_

## `clisc subscribe`

monitor a target smart contract's function invocations or event occurrences starting from a smart contract's descriptor.

```
USAGE
  $ clisc subscribe

OPTIONS
  -F, --file=file          path to a JSON file that contains all required parameter for the specific request
  -a, --auth=auth          authorization token
  -c, --contract=contract  (required) name of the contract to interact with
  -d, --doc=doc            degree of confidence's value
  -e, --event=event        (required) name of the request's target event
  -f, --filter=filter      C-style boolean expression over function/event parameters
  -h, --help               show subscribe command help
  -i, --corrId=corrId      client-provided correlation identifier
  -j, --jsonrpc=jsonrpc    (required) jsonrpc request identifier
  -m, --method=method      (required) name of the request's target function/method
  -p, --path=path          provide a path where the config files are located, if not set, the current directory is used
  -u, --callback=callback  callback URL to which the gateway will send all asynchronous responses

  -v, --val=val            target function or event parameter's value, if more than one value is required you can set
                           this flag multiple times (the order is important!)
```

_See code: [dist/commands/subscribe.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/subscribe.ts)_

## `clisc unsubscribe`

stop live monitoring of a smart contract's function or event by unsubscribing a previous subscription.

```
USAGE
  $ clisc unsubscribe

OPTIONS
  -F, --file=file          path to a JSON file that contains all required parameter for the specific request
  -a, --auth=auth          authorization token
  -c, --contract=contract  (required) name of the contract to interact with
  -e, --event=event        (required) name of the request's target event
  -h, --help               show unsubscribe command help
  -i, --corrId=corrId      client-provided correlation identifier
  -j, --jsonrpc=jsonrpc    (required) jsonrpc request identifier
  -m, --method=method      (required) name of the request's target function/method
  -p, --path=path          provide a path where the config files are located, if not set, the current directory is used

  -v, --val=val            target function or event parameter's value, if more than one value is required you can set
                           this flag multiple times (the order is important!)
```

_See code: [dist/commands/unsubscribe.ts](https://github.com/lampajr/toolscip/blob/v1.0.0/dist/commands/unsubscribe.ts)_
<!-- commandsstop -->
