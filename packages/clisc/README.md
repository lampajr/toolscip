# clisc

Command Line Interface for Smart Contracts interaction

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@toolscip/clisc)](https://www.npmjs.com/package/@toolscip/clisc)
[![Downloads/week](https://img.shields.io/npm/dw/@toolscip/clisc)](https://www.npmjs.com/package/@toolscip/clisc)
![License](https://img.shields.io/github/license/lampajr/toolscip)

<!-- toc -->
* [clisc](#clisc)
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
@toolscip/clisc/1.0.3 linux-x64 node-v10.19.0
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
* [`clisc invoke CONTRACT`](#clisc-invoke-contract)
* [`clisc query CONTRACT`](#clisc-query-contract)
* [`clisc scdl:add CONTRACT`](#clisc-scdladd-contract)
* [`clisc scdl:delete CONTRACT`](#clisc-scdldelete-contract)
* [`clisc scdl:list [KEYWORD]`](#clisc-scdllist-keyword)
* [`clisc subscribe CONTRACT`](#clisc-subscribe-contract)
* [`clisc unsubscribe CONTRACT`](#clisc-unsubscribe-contract)

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

initialize the 'clisc' configuration files, this command MUST be executed in the directory where the user wants to store the project.

```
USAGE
  $ clisc init

OPTIONS
  -h, --help       show init command help
  -p, --path=path  provide a path where the config files are located, if not set, the current directory is used
  -s, --server     initialize a simple server for receiving asynchronous responses

EXAMPLES
  # Initialize the 'clisc' configuration files for the current project
  $ clisc init
  # Initialize the 'clisc' configuration files for the current project with a simple express.js server for the 
  asynchronous responses
  $ clisc init --server
```

_See code: [dist/commands/init.ts](https://github.com/lampajr/toolscip/blob/v1.0.3/dist/commands/init.ts)_

## `clisc invoke CONTRACT`

invoke a target smart contract's function/method starting from a smart contract's descriptor.

```
USAGE
  $ clisc invoke CONTRACT

ARGUMENTS
  CONTRACT  name of the contract to interact with

OPTIONS
  -F, --file=file            path to a JSON file that contains all required parameter for the specific request
  -I, --id=id                jsonrpc request identifier
  -a, --auth=auth            authorization token
  -d, --doc=doc              degree of confidence's value
  -h, --help                 show invoke command help
  -i, --corrId=corrId        (required) client-provided correlation identifier
  -l, --logger               whether enable or not the file logger
  -m, --method=method        (required) name of the request's target function/method

  -p, --path=path            provide a path where the config files are located, if not set, the current directory is
                             used

  -s, --signature=signature  [default: sha256] cryptographic hash function's name that has to be used to sign the
                             request

  -t, --timeout=timeout      timeout that the gateway have to wait before block the operation

  -u, --callback=callback    callback URL to which the gateway will send all asynchronous responses

  -v, --value=value          target function or event parameter's value, if more than one value is required you can set
                             this flag multiple times (the order is important!)

EXAMPLES
  # Invoke a method named 'balanceOf' of a contract named 'Token'
  $ clisc invoke Token -I abcdef --method=balanceOf --value=0x23ab34bd..
```

_See code: [dist/commands/invoke.ts](https://github.com/lampajr/toolscip/blob/v1.0.3/dist/commands/invoke.ts)_

## `clisc query CONTRACT`

query past event occurences or function invocations of a target smart contract

```
USAGE
  $ clisc query CONTRACT

ARGUMENTS
  CONTRACT  name of the contract to interact with

OPTIONS
  -F, --file=file            path to a JSON file that contains all required parameter for the specific request
  -I, --id=id                jsonrpc request identifier
  -a, --auth=auth            authorization token
  -d, --endTime=endTime      end time from which stop considering event occurrences or function invocations
  -e, --event=event          (required) name of the request's target event
  -f, --filter=filter        C-style boolean expression over function/event parameters
  -h, --help                 show query command help
  -l, --logger               whether enable or not the file logger
  -m, --method=method        (required) name of the request's target function/method

  -p, --path=path            provide a path where the config files are located, if not set, the current directory is
                             used

  -s, --startTime=startTime  start time from which start considering event occurrences or function invocations

  -v, --value=value          target function or event parameter's value, if more than one value is required you can set
                             this flag multiple times (the order is important!)

EXAMPLES
  # Query past invocations of 'Token' contract's 'balanceOf' method
  $ clisc query Token -I abcdefg --method=balanceOf --value=0x23f3ab3
  # Query past occurrences of 'Token' contract's 'Approval' event
  $ clisc query Token -I abcdefg --event=Approval
```

_See code: [dist/commands/query.ts](https://github.com/lampajr/toolscip/blob/v1.0.3/dist/commands/query.ts)_

## `clisc scdl:add CONTRACT`

add a new SCDL descriptor in the local directory.

```
USAGE
  $ clisc scdl:add CONTRACT

ARGUMENTS
  CONTRACT  path to a local SCDL file or a unique identifier inside the online registry

OPTIONS
  -h, --help       show scdl:add command help
  -l, --local      add a new descriptor from a local file path
  -p, --path=path  provide a path where the config files are located, if not set, the current directory is used
  -r, --remote     add a new descriptor from a remote online registry

ALIASES
  $ clisc scdl:add
  $ clisc scdl:load

EXAMPLES
  # add a new descriptor from a local file
  $ clisc scdl:add MyToken.json --local
  # download a descriptor from an online registry
  $ clisc scdl:add 5dfcdad2fd321d00179ede01 --remote
```

_See code: [dist/commands/scdl/add.ts](https://github.com/lampajr/toolscip/blob/v1.0.3/dist/commands/scdl/add.ts)_

## `clisc scdl:delete CONTRACT`

delete a specific descriptor from the local directory

```
USAGE
  $ clisc scdl:delete CONTRACT

ARGUMENTS
  CONTRACT  name of the contract's descriptor to delete

OPTIONS
  -h, --help       show scdl:list command help
  -p, --path=path  provide a path where the config files are located, if not set, the current directory is used

ALIASES
  $ clisc scdl:delete
  $ clisc scdl:remove
  $ clisc scdl:del
  $ clisc scdl:rm

EXAMPLES
  # delete a descriptor file named 'ZilliqaToken.json'
  $ clisc scdl:delete ZilliqaToken.json
```

_See code: [dist/commands/scdl/delete.ts](https://github.com/lampajr/toolscip/blob/v1.0.3/dist/commands/scdl/delete.ts)_

## `clisc scdl:list [KEYWORD]`

list saved SCDL smart contract's descriptors

```
USAGE
  $ clisc scdl:list [KEYWORD]

ARGUMENTS
  KEYWORD  keyword search

OPTIONS
  -e, --extended   display all saved descriptors
  -h, --help       show scdl:list command help
  -m, --max=max    maximum number of descriptors to display
  -p, --path=path  provide a path where the config files are located, if not set, the current directory is used

ALIASES
  $ clisc scdl:list
  $ clisc scdl:ls
  $ clisc scdl:index
  $ clisc scdl:get

EXAMPLES
  # list a default number of saved descriptors
  $ clisc scdl:list
  # list all saved descriptors
  $ clisc scdl:list --extended
  # list a maximum of 5 descriptors
  $ clisc scdl:list --max 5
  # list all descriptors that match the provided keyword
  $ clisc scdl:list Token
```

_See code: [dist/commands/scdl/list.ts](https://github.com/lampajr/toolscip/blob/v1.0.3/dist/commands/scdl/list.ts)_

## `clisc subscribe CONTRACT`

monitor a target smart contract's function invocations or event occurrences starting from a smart contract's descriptor.

```
USAGE
  $ clisc subscribe CONTRACT

ARGUMENTS
  CONTRACT  name of the contract to interact with

OPTIONS
  -F, --file=file          path to a JSON file that contains all required parameter for the specific request
  -I, --id=id              jsonrpc request identifier
  -a, --auth=auth          authorization token
  -d, --doc=doc            degree of confidence's value
  -e, --event=event        (required) name of the request's target event
  -f, --filter=filter      C-style boolean expression over function/event parameters
  -h, --help               show subscribe command help
  -i, --corrId=corrId      (required) client-provided correlation identifier
  -m, --method=method      (required) name of the request's target function/method
  -p, --path=path          provide a path where the config files are located, if not set, the current directory is used
  -u, --callback=callback  callback URL to which the gateway will send all asynchronous responses

  -v, --value=value        target function or event parameter's value, if more than one value is required you can set
                           this flag multiple times (the order is important!)

EXAMPLES
  # Subscribe to 'Token' contract's 'balanceOf' method
  $ clisc subscribe Token -I abcdefg --method=balanceOf --value=0x23f3ab3 --callback=http://mydomain.org
  # Subscribe to 'Token' contract's 'Approval' event
  $ clisc subscribe Token -I abcdefg --event=Approval --callback=http://mydomain.org
```

_See code: [dist/commands/subscribe.ts](https://github.com/lampajr/toolscip/blob/v1.0.3/dist/commands/subscribe.ts)_

## `clisc unsubscribe CONTRACT`

stop live monitoring of a smart contract's function or event by unsubscribing a previous subscription.

```
USAGE
  $ clisc unsubscribe CONTRACT

ARGUMENTS
  CONTRACT  name of the contract to interact with

OPTIONS
  -F, --file=file      path to a JSON file that contains all required parameter for the specific request
  -I, --id=id          jsonrpc request identifier
  -a, --auth=auth      authorization token
  -e, --event=event    (required) name of the request's target event
  -h, --help           show unsubscribe command help
  -i, --corrId=corrId  (required) client-provided correlation identifier
  -m, --method=method  (required) name of the request's target function/method
  -p, --path=path      provide a path where the config files are located, if not set, the current directory is used

  -v, --val=val        target function or event parameter's value, if more than one value is required you can set this
                       flag multiple times (the order is important!)

EXAMPLES
  # Unsubscribe a previous subscription to a 'Token' contract's 'balanceOf' method
  $ clisc unsubscribe Token -I abcdefg --method=balanceOf
  # Unsubscribe a previous subscription to a 'Token' contract's 'Approval' event
  $ clisc unsubscribe Token -I abcdefg --event=Approval
```

_See code: [dist/commands/unsubscribe.ts](https://github.com/lampajr/toolscip/blob/v1.0.3/dist/commands/unsubscribe.ts)_
<!-- commandsstop -->
