# `scip-lib`



This is a simple [Smart Contract Invocation Protocol]() compliant parser and generator library written in Typescript for [Node.js](https://nodejs.org/en/). It was built out as an extension of the [jsonrpc-lib](https://github.com/lampajr/jsonrpc-lib) since SCIP is made out as an extension of [JSON-RPC](https://www.jsonrpc.org/specification).

## Table of Contents

* [SCIP Specification](#scip-specification)
  * [Invoke](#invoke-method)
  * [Subscribe](#subscribe-method)
  * [Unsubscribe](#unsubscribe-method)
  * [Query](#query-method)
  * [Binding](#binding)
* [Class Documentation](#class-documentation)
* [Function Documentation](#function-documentation)
* [Usage](#usage)
* [Examples](#examples)
* [Contributing](#contributing)



## SCIP Specification

The *Smart Contract Invocation Protocol* is a protocol intended to provide a protocol specification in the context of blockchains integration that allows external consumer applications to invoke smart contract functions in a uniform manner regardless of the underlying blockchain technology. Moreover it provides the capability to monitor smart contracts at runtime. Its core consists of a set of *methods* that can be used by blockchain-external consumer application to interact with *smart contracts*. 

In particular the protocol defines four different methods which are used to perform the following operations:

* The *invocation* of a smart contract function
* The *subscription* to notifications regarding function invocations or event occurrences
* The *unsubscription* from live monitoring
* The *querying* of past invocations or events

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

* *jsonrpc*: 2.0  as for generic json-rpc message
* *id*: string or number as for any json-rpc message
* *method*: this can only be one of [*invoke, subscribe, unsubscribe* and *query*]
* *params*: the parameter object must have specific form in acccording to the method that has to be invoked.
* *result*: any, as for a generic json-rpc success response
* *error*: same error object in a generic json-rpc error response, SCIP provides additional codes that are strictly correlated to the blockchain field.

**Reference**: A complete protocol specification can be found in the Github [scip repository](https://github.com/lampajr/scip).

## Class Documentation

This library was built in an OOP perspective, providing a class definition for each SCIP message.

#### SCIP Requests

| Request        | Class                | Method        | Params                                            |                Description                 |
| -------------- | -------------------- | ------------- | ------------------------------------------------- | :----------------------------------------: |
| Invocation     | `ScipInvocation`     | *Invoke*      | `Invocation`                                      |     Function invocation request object     |
| Subscription   | `ScipSubscription`   | *Subscribe*   | `EventSubscription` or `FunctionSubscription`     | Function/event subscription request object |
| Unsubscription | `ScipUnsubscription` | *Unsubscribe* | `EventUnsubscription` or `FunctionUnsubscription` |     Cancel subscription request object     |
| Query          | `ScipQuery`          | *Query*       | `EventQuery` or `FunctionQuery`                   |    Function/event query request object     |

**Note**: the *params* objects are specific class objects

#### SCIP Responses

| Response              | Class             |                         Description                          |
| --------------------- | ----------------- | :----------------------------------------------------------: |
| Success (sync)        | `ScipSuccess`     |         Generic synchronous success response object          |
| Error (sync)          | `ScipError`       |              Synchronous error response object               |
| Query Response (sync) | `ScipQueryResult` | Synchronous response of a `Query` request, extension of `ScipSuccess` |
| Callback (async)      | `ScipCallback`    | Asynchronous response of a SCIP gateway, in a json-rpc context it acts as a `Notification` |

**Reference**: a complete class documentation can be found at [scip-lib]().

## Function Documentation

This library provides a set of tools that allows a client to easily handle and generates SCIP messages, in particular it provides the following functions:

| Function              | Return               | Description                                                  |
| --------------------- | -------------------- | ------------------------------------------------------------ |
| `parse`               | `ScipMessage`        | Parse a generic object checking its validity, if so it returns the specific SCIP object instance, otherwise it throws an `ErrorObject` |
| `invoke`              | `ScipInvocation`     | Generates a `ScipInvocation` message if the params is a valid `Invocation` object. |
| `subscribeEvent`      | `ScipSubscription`   | Generates a `ScipSubscription` message if the params is a valid `EventSubscription` object. |
| `subscribeFunction`   | `ScipSubscription`   | Generates a `ScipSubscription` message if the params is a valid `FunctionSubscription` object. |
| `unsubscribeEvent`    | `ScipUnsubscription` | Generates a `ScipUnsubscription` message if the params is a valid  `EventUnsubscription` object. |
| `unsubscribeFunction` | `ScipUnsubscription` | Generates a `ScipUnsubscription` message if the params is a valid `FunctionUnsubscription` object. |
| `queryEvent`          | `ScipQuery`          | Generates a `ScipQuery` message if the params is a valid `EventQuery` object. |
| `queryFunction`       | `ScipQuery`          | Generates a `ScipQuery` message if the params is a valid `FunctionQuery` object. |



## Usage

```
const scipLib = require('scip-lib');

// TODO: DEMONSTRATE API`
```



## Examples



## Contributing

