# `scip-lib`

![Version](https://www.npmjs.com/package/@toolscip/scip-lib)
![Downloads/week]](https://img.shields.io/npm/dw/@toolscip/scip-lib)
![License](https://img.shields.io/github/license/lampajr/toolscip)

This is a simple [Smart Contract Invocation Protocol]() compliant parser and generator library written in Typescript for [Node.js](https://nodejs.org/en/). It was built out as an extension of the [jsonrpc-lib](https://github.com/lampajr/jsonrpc-lib) since SCIP is made out as an extension of [JSON-RPC](https://www.jsonrpc.org/specification).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [SCIP Specification](#scip-specification)
  - [Invoke](#invoke-method)
  - [Subscribe](#subscribe-method)
  - [Unsubscribe](#unsubscribe-method)
  - [Query](#query-method)
  - [Binding](#binding)
- [Classes](#classes)
- [Functions](#functions)
- [Examples](#examples)
- [Contributing](#contributing)

## Installation

The package can be simply installed via [npm](https://www.npmjs.com/), a suggestion is to import the package locally as follow:

```bash
npm install --save @toolscip/scip-lib
```

## Usage

In order to use this module you just have to import it like any other _npm_ package:

_JavaScript_ import

```javascript
const scip = require('@toolscip/scip-lib');
```

_Typescript_ import

```typescript
import scip from '@toolscip/scip-lib';
// or
import { scip } from '@toolscip/scip-lib';
```

One of the main functionality that this package provides is the _parse_ function that allows a client to parse a string message, checks whether it a SCIP-compliant message and then if valid it generates the corresponding SCIP object, otherwise it throws an exception (i.e. `ErrorObject`) containing information about what is invalid in the string message.

Suppose to have received a message request as the following one:

```json
{
  "jsonrpc": "2.0",
  "id": "abcdefg",
  "method": "Invoke",
  "params": {
    "functionId": "send",
    "inputs": [
      {
        "type": {
          "type": "number"
        },
        "name": "amount",
        "value": 50
      }
    ],
    "outputs": []
  }
}
```

Now you just have to invoke the _parse_ function providing the message as input, if the message is valid the function will return the object instance of a SCIP message (i.e. `ScipInvocation`, `ScipSubscription`, `ScipUnsubscription`, `ScipQuery`, `ScipCallback`, `ScipSuccess` and `ScipError`).

```typescript
try {
  const obj = scip.parse(msg);
  // `obj` will be an instance of a ScipInvocation class
} catch (err) {
  console.log('Error message: ' + err.message); // error description
  console.log('Error code: ' + err.code); // scip error code
  console.log('Error data: ' + err.data); // scip error additional data
}
```

**Note**: the input message must be in string format.

There are two different flavours of the `parse` function, the `parseRequest` and the `parseResponse`, which act exactly as the _parse_ function, providing additional check over the specific SCIP message by throwing an error if the parsed data is not a _request_ or a _response_ respectively.

This package provides also other function that are mainly used to create new _SCIP_ messages instances, all of them require an `id` (i.e. json-rpc id) and a `params` object that must be a valid SCIP _params_ object in according to the specific invoked function (i.e. `Invocation`, `FunctionSubscription`, `EventSubscription`, `FunctionUnsubscription`, `EventUnsubscription`, `FunctionQuery`, `EventQuery`, `QueryResult` and `Callback`).

The _params_ object can be directly provided as instance of one of the aforementioned classes or as generic JSON object.

```typescript
const param = {
  functionId: 'send',
  inputs: [
    {
      type: {
        type: 'number',
      },
      name: 'amount',
      value: 50,
    },
  ],
  outputs: [],
};

try {
  const invObj = scip.invoke('abcdefg', param);
  // 'invObj' will be an instance of a ScipInvocation
} catch (err) {
  console.log('Error message: ' + err.message); // error description
  console.log('Error code: ' + err.code); // scip error code
  console.log('Error data: ' + err.data); // scip error additional data
}
```

## SCIP Specification

The _Smart Contract Invocation Protocol_ is a protocol intended to provide a protocol specification in the context of blockchains integration that allows external consumer applications to invoke smart contract functions in a uniform manner regardless of the underlying blockchain technology. Moreover it provides the capability to monitor smart contracts at runtime. Its core consists of a set of _methods_ that can be used by blockchain-external consumer application to interact with _smart contracts_.

In particular the protocol defines four different methods which are used to perform the following operations:

- The _invocation_ of a smart contract function
- The _subscription_ to notifications regarding function invocations or event occurrences
- The _unsubscription_ from live monitoring
- The _querying_ of past invocations or events

#### Invoke Method

This method allows an external application to invoke a specific smart contract's function. It requires a synchronous response notifying the success or not of the request and then an asynchronous message notifying the result of the function invocation.

#### Subscribe Method

This method allows to monitor smart contract's functions and/or events, in particular can be used to be notified whenever an event is triggered by the smart contract or a specific function has been invoked. It requires a synchronous response notifying the success or not of the request and then one or more asynchronous responses notifying the occurrences of what the consumer have subscribed.

#### Unsubscribe Method

This method is simply used to cancel previously established subscription, this can be used to cancel one or more subscription in according to the request parameters.

#### Query Method

This is a fully synchronous request method which is used to retrieve past event occurrences or function invocations. This method does not have asynchronous responses from the gateway.

#### Binding

SCIP does not force to use a specific protocol for carrying all these messages, hence different bindings could be used. Here, we have decided to propose a JSON-RPC binding for SCIP, which is a stateless transport-agnostic remote procedure call protocol that uses JSON as its data format. A complete binding can be found at [scip binding](https://github.com/lampajr/scip/blob/master/README.md#json-rpc-binding).

In according to the binding proposed in the [specification](https://github.com/lampajr/scip/blob/master/README.md) we have built this library out of a JSON-RPC parser library since every SCIP message is also a JSON-RPC 2.0 compliant message. Hence the SCIP can be seen as a restriction of the JSON-RPC protocol:

- _jsonrpc_: 2.0 as for generic json-rpc message
- _id_: string or number as for any json-rpc message
- _method_: this can only be one of [*invoke, subscribe, unsubscribe* and *query*]
- _params_: the parameter object must have specific form in acccording to the method that has to be invoked.
- _result_: any, as for a generic json-rpc success response
- _error_: same error object in a generic json-rpc error response, SCIP provides additional codes that are strictly correlated to the blockchain field.

**Reference**: A complete protocol specification can be found in the [Github repository](https://github.com/lampajr/scip).

## Classes

This library was built in an OOP perspective, providing a class definition for each SCIP message.

#### SCIP Requests

| Request        | Class                | Method        | Params                                            |                Description                 |
| -------------- | -------------------- | ------------- | ------------------------------------------------- | :----------------------------------------: |
| Invocation     | `ScipInvocation`     | _Invoke_      | `Invocation`                                      |     Function invocation request object     |
| Subscription   | `ScipSubscription`   | _Subscribe_   | `EventSubscription` or `FunctionSubscription`     | Function/event subscription request object |
| Unsubscription | `ScipUnsubscription` | _Unsubscribe_ | `EventUnsubscription` or `FunctionUnsubscription` |     Cancel subscription request object     |
| Query          | `ScipQuery`          | _Query_       | `EventQuery` or `FunctionQuery`                   |    Function/event query request object     |

**Note**: the _params_ objects are specific class objects

#### SCIP Responses

| Response              | Class             |                                        Description                                         |
| --------------------- | ----------------- | :----------------------------------------------------------------------------------------: |
| Success (sync)        | `ScipSuccess`     |                        Generic synchronous success response object                         |
| Error (sync)          | `ScipError`       |                             Synchronous error response object                              |
| Query Response (sync) | `ScipQueryResult` |           Synchronous response of a `Query` request, extension of `ScipSuccess`            |
| Callback (async)      | `ScipCallback`    | Asynchronous response of a SCIP gateway, in a json-rpc context it acts as a `Notification` |

**Reference**: a complete class documentation can be found at [scip-lib]().

## Functions

This library provides a set of tools that allows a client to easily handle and generates SCIP messages, in particular it provides the following functions:

| Function              | Return               | Description                                                                                                                                                           |
| --------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parse`               | `ScipMessage`        | Parse a generic object checking its validity, if so it returns the specific SCIP object instance, otherwise it throws an `ErrorObject`                                |
| `parseRequest`        | `ScipRequest`        | Same as `parse` function, which, in addition, throws an error even if the parsed data is a valid SCIP message but not a valid request (e.g. a response)               |
| `parseResponse`       | `ScipResponse`       | Same as `parse` function, which, in addition, throws an error even if the parsed data is a valid SCIP message but not a valid async or sync response (e.g. a request) |
| `invoke`              | `ScipInvocation`     | Generates a `ScipInvocation` message if the params is a valid `Invocation` object.                                                                                    |
| `subscribeEvent`      | `ScipSubscription`   | Generates a `ScipSubscription` message if the params is a valid `EventSubscription` object.                                                                           |
| `subscribeFunction`   | `ScipSubscription`   | Generates a `ScipSubscription` message if the params is a valid `FunctionSubscription` object.                                                                        |
| `unsubscribeEvent`    | `ScipUnsubscription` | Generates a `ScipUnsubscription` message if the params is a valid `EventUnsubscription` object.                                                                       |
| `unsubscribeFunction` | `ScipUnsubscription` | Generates a `ScipUnsubscription` message if the params is a valid `FunctionUnsubscription` object.                                                                    |
| `queryEvent`          | `ScipQuery`          | Generates a `ScipQuery` message if the params is a valid `EventQuery` object.                                                                                         |
| `queryFunction`       | `ScipQuery`          | Generates a `ScipQuery` message if the params is a valid `FunctionQuery` object.                                                                                      |

## Examples

A simple example of _scip-lib_ usage is inside a _SCIP server_.

**Note**: `express` and `body-parser` are external packages, which are strictly correlated to the following example of usage, but they are not mandatory, you can use whatever you prefer.

```typescript
import * as express from 'express';
import * as bodyParser from 'body-parser';
import scip, { ScipMessage, types } from '@toolscip/scip-lib';

const PORT = 8000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Handle POST request */
app.post('/', (req, res) => {
  const body = req.body;
  try {
    const request = scip.parseRequest(body);
    const result = handleRequest(request);
    const response = scip.success(request.id, result); // SCIP success response
    res.json(response);
  } catch (err) {
    // notice that err is already a valid jsonrpc ErrorObject
    const error = scip.error(req.body.id, err); // SCIP error response
    res.json(error);
  }
});

/* Start the server */
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
```

The `handleRequest` can be written as follows:

```typescript
/**
 * Executes some task in according to the specific kind of the SCIP request, hence in 'jsonrpc' context, it performs the code directly associated with the called 'method'.
 * @param msg: message request
 * @returns the result of the specific message invocation
 */
function handleRequest(msg: ScipMessage): any {
  if (msg instanceof types.ScipInvocation) {
    // ...
  } else if (msg instanceof types.ScipInvocation) {
  } else if (msg instanceof types.ScipSubscription) {
  } else if (msg instanceof types.ScipUnsubscription) {
  } else if (msg instanceof types.ScipQuery) {
  } // ...
}
```

If you want to see another, completely different, example of usage please take a look at the [clisc](https://github.com/lampajr/toolscip/tree/master/packages/clisc), a Node.js command line interface, which was built for automating the _SCIP_ request invocations.

## Contributing

Feel free to post questions and problems on the issue tracker. Pull requests are welcome!

Feel free to fork and modify or add new features and functionality to the library
