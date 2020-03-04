/**
 * * * Copyright * 2019 Andrea Lamparelli
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * This module provides several classes definition that represent Smart
 * Contract Invocation Protocol messages and their payloads. The payloads
 * will have different structure with different attributes, a complete list
 * of used attributes is the following:
 *
 * General attribute description:
 * *functionIdentifier* :               the name of the function
 * *eventIdentifier* :                  the name of the function
 * *inputs* :                   a list of function input parameters
 * *outputs* :                  a list of function/event output parameters
 * *parameters* :                   a list of parameters
 * *callbackUrl* :                 the URL to which the Callback message must be sent by the server
 * *correlationIdentifier* :    a client-provided correlation identifier
 * *doc* :       the degree of confidence required from the transaction to be considered as premanent by the client
 * *timeout* :                  the number of seconds the gateway should wait for the transaction to gain the required degree of confidence
 * *signature* :                the client's base 64-encoded signature of the content of a request message
 * *isoTimestamp* :                the UTC time at which an occurrence happened
 * *startTime* :                start time from which consider the event occurrences or function invocations
 * *endTime* :                  end time from which consider the event occurrences or function invocations
 * *filter* :                   a C-style boolean expression over parameters
 *
 * Parameter attribute description
 * *name* :                     the name of the parameter
 * *type* :                     the abstract blockhain-agnostic type of this parameter
 * *value* :                    the value of this parameter
 */

import {
  ErrorObject,
  Id,
  JsonRpcNotification,
  JsonRpcRequest,
  JsonRpcSuccess,
  JsonRpcError,
} from '@lampajr/jsonrpc-lib';

/**************************************** SCIP parameters Types ****************************************/
/**
 * Generic Scip parameter, which is used for both
 * functions and events.
 */
export class Parameter {
  name: string;
  type: string;
  value?: any;

  constructor(name: string, type: string, value?: any) {
    this.name = name;
    this.type = type;
    this.value = value;
  }
}

/**
 * The Invocation object is used as jsonrpc param for the **invoke**
 * method request, it contains all information needed for the server
 * to understand which function the client would invoke and with which
 * parameters.
 */
export class Invocation {
  functionIdentifier: string;
  inputs: Parameter[];
  outputs: Parameter[];
  signature: string;
  doc: number;
  callbackUrl?: string;
  correlationIdentifier?: string;
  timeout?: number;

  constructor(
    functionIdentifier: string,
    inputs: Parameter[],
    outputs: Parameter[],
    signature: string,
    doc: number,
    callbackUrl?: string,
    correlationIdentifier?: string,
    timeout?: number,
  ) {
    this.functionIdentifier = functionIdentifier;
    this.inputs = inputs;
    this.outputs = outputs;
    this.callbackUrl = callbackUrl;
    this.correlationIdentifier = correlationIdentifier;
    this.doc = doc;
    this.timeout = timeout;
    this.signature = signature;
  }
}

/**
 * The Subscription objectis used as jsonrpc parameters member for
 * the **subscribe** scip method, there two kind of subscription:
 * the *event* one, which addiotionally contains an eventIdentifier, and a
 * *function* one, which includes a functionIdentifier instead.
 */
class Subscription {
  parameters: Parameter[];
  callbackUrl: string;
  doc: number;
  correlationIdentifier?: string;
  filter?: string;

  constructor(
    parameters: Parameter[],
    callbackUrl: string,
    doc: number,
    correlationIdentifier?: string,
    filter?: string,
  ) {
    this.parameters = parameters;
    this.callbackUrl = callbackUrl;
    this.correlationIdentifier = correlationIdentifier;
    this.doc = doc;
    this.filter = filter;
  }
}

/**
 * [[Subscription]]
 */
export class EventSubscription extends Subscription {
  eventIdentifier: string;

  constructor(
    eventIdentifier: string,
    parameters: Parameter[],
    callbackUrl: string,
    doc: number,
    correlationIdentifier?: string,
    filter?: string,
  ) {
    super(parameters, callbackUrl, doc, correlationIdentifier, filter);
    this.eventIdentifier = eventIdentifier;
  }
}

/**
 * [[Subscription]]
 */
export class FunctionSubscription extends Subscription {
  functionIdentifier: string;

  constructor(
    functionIdentifier: string,
    parameters: Parameter[],
    callbackUrl: string,
    doc: number,
    correlationIdentifier?: string,
    filter?: string,
  ) {
    super(parameters, callbackUrl, doc, correlationIdentifier, filter);
    this.functionIdentifier = functionIdentifier;
  }
}

/**
 * The Unsubscription object is used as jsonrpc parameters member for
 * the **unsubscribe** scip method, there two kind of unsubscription:
 * the *event* one, which addiotionally contains an eventIdentifier, and a
 * *function* one, which includes a functionIdentifier instead.
 */
class Unsubscription {
  parameters: Parameter[];
  correlationIdentifier?: string;

  constructor(parameters: Parameter[], correlationIdentifier?: string) {
    this.parameters = parameters;
    this.correlationIdentifier = correlationIdentifier;
  }
}

/**
 * [[Unsubscription]]
 */
export class EventUnsubscription extends Unsubscription {
  eventIdentifier: string;

  constructor(eventIdentifier: string, parameters: Parameter[], correlationIdentifier?: string) {
    super(parameters, correlationIdentifier);
    this.eventIdentifier = eventIdentifier;
  }
}

/**
 * [[Unsubscription]]
 */
export class FunctionUnsubscription extends Unsubscription {
  functionIdentifier: string;

  constructor(functionIdentifier: string, parameters: Parameter[], correlationIdentifier?: string) {
    super(parameters, correlationIdentifier);
    this.functionIdentifier = functionIdentifier;
  }
}

/**
 * The Timeframe represents the time interval to analyze for
 * query requests.
 */
class Timeframe {
  from?: string;
  to?: string;

  constructor(from?: string, to?: string) {
    this.from = from;
    this.to = to;
  }
}

/**
 * The Query object is used as jsonrpc parameters for the **query** scip method,
 * contains helpful information that allow the server to understand what
 * previous occurrences select and return.
 */
class Query {
  parameters: Parameter[];
  filter?: string;
  timeframe?: Timeframe;

  constructor(parameters: Parameter[], filter?: string, timeframe?: Timeframe) {
    this.parameters = parameters;
    this.filter = filter;
    this.timeframe = timeframe;
  }
}

/**
 * [[Query]]
 */
export class EventQuery extends Query {
  eventIdentifier: string;

  constructor(eventIdentifier: string, parameters: Parameter[], filter?: string, timeframe?: Timeframe) {
    super(parameters, filter, timeframe);
    this.eventIdentifier = eventIdentifier;
  }
}

/**
 * [[Query]]
 */
export class FunctionQuery extends Query {
  functionIdentifier: string;

  constructor(functionIdentifier: string, parameters: Parameter[], filter?: string, timeframe?: Timeframe) {
    super(parameters, filter, timeframe);
    this.functionIdentifier = functionIdentifier;
  }
}

/**
 * The QueryResult is the payload of a jsonrpc success
 * response returned by the server after query request
 * was received and succeed.
 */
export class QueryResult {
  occurrences: Occurrence[];

  constructor(occurrences: Occurrence[]) {
    this.occurrences = occurrences;
  }
}

/**
 * Single Occurrence which contains the isoTimestamp when it has occurred
 * with the values of their returned values or input parameters.
 */
export class Occurrence {
  parameters: Parameter[];
  isoTimestamp: string;

  constructor(parameters: Parameter[], isoTimestamp: string) {
    this.parameters = parameters;
    this.isoTimestamp = isoTimestamp;
  }
}

/**
 * The Callback object represents the payload
 * of an asynchronous server response, which is
 * a jsonrpc notification triggered by the server
 * once the function invocation or the live
 * monitoring has produced some results.
 */
export class Callback {
  parameters: Parameter[];
  isoTimestamp: string;
  correlationIdentifier?: string;

  constructor(parameters: Parameter[], isoTimestamp: string, correlationIdentifier?: string) {
    this.parameters = parameters;
    this.correlationIdentifier = correlationIdentifier;
    this.isoTimestamp = isoTimestamp;
  }
}

/******************************************** SCIP Messages ********************************************/

export class ScipInvocation extends JsonRpcRequest {
  constructor(id: Id, parameters: Invocation) {
    super(id, 'Invoke', parameters);
  }
}

export class ScipSubscription extends JsonRpcRequest {
  constructor(id: Id, parameters: Subscription) {
    super(id, 'Subscribe', parameters);
  }
}

export class ScipUnsubscription extends JsonRpcRequest {
  constructor(id: Id, parameters: Unsubscription) {
    super(id, 'Unsubscribe', parameters);
  }
}

export class ScipQuery extends JsonRpcRequest {
  constructor(id: Id, parameters: Query) {
    super(id, 'Query', parameters);
  }
}

export class ScipCallback extends JsonRpcNotification {
  static validMethod = 'ReceiveCallback';

  constructor(parameters: Callback) {
    super('ReceiveCallback', parameters);
  }
}

export class ScipSuccess extends JsonRpcSuccess {
  constructor(id: Id, result: any) {
    super(id, result);
  }
}

export class ScipQueryResult extends ScipSuccess {
  constructor(id: Id, result: QueryResult) {
    super(id, result);
  }
}

export class ScipError extends JsonRpcError {
  constructor(id: Id, error: ScipErrorObject) {
    super(id, error);
  }
}

/**
 * This class is an extension of the generic jsonrpc [[jsonrpc-lib.ErrorObject]]
 * that adds several custom scip errors through the definition of static
 * functions that automatically generate the equivalent ErrorObject instance
 */
export class ScipErrorObject extends ErrorObject {
  static notFound(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32000, 'Not Found', data);
  }

  static invalidParameters(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32001, 'Invalid Parameters', data);
  }

  static missingCertificate(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32002, 'Missing Certificate', data);
  }

  static notAuthorized(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32003, 'Not Authorized', data);
  }

  static notSupported(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32004, 'Not Supported', data);
  }

  static connectionException(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32005, 'Connection Exception', data);
  }

  static transactionInvalidatedException(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32006, 'Transaction Invalidated Exception', data);
  }

  static invalidScipParam(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32007, 'Invalid Scip Parameter', data);
  }

  static invocationError(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32100, 'Invocation Error', data);
  }

  static executionError(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32101, 'Execution Error', data);
  }

  static insufficientFunds(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32102, 'Insufficient Funds', data);
  }

  static balNotAuthorized(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32103, 'Bal Not Authorized', data);
  }

  static timeout(data?: any): ScipErrorObject {
    return new ScipErrorObject(-32201, 'Timeout', data);
  }

  constructor(code: number, message: string, data?: any) {
    super(code, message, data);
  }
}
