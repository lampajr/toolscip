/**
 * * Copyright * 2019 Andrea Lamparelli
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
 *
 * Smart Contract Invocation Protocol nodejs implementation
 * **Specification**: https://github.com/lampajr/scip/blob/master/README.md
 */

import {
  Id,
  JsonRpcNotification,
  JsonRpcRequest,
  JsonRpcSuccess,
  parse as parseJsonrpc,
  JsonRpcMessage,
  JsonRpcError,
} from '@lampajr/jsonrpc-lib';

import * as types from './types';
import * as validation from './validation';

/****************************************** SCIP Params parser ******************************************/

/**
 * Parse a generic object into an [[types.Parameter]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseParameter(obj: any): types.Parameter {
  validation.validateAbsType(obj.type);
  validation.validateName(obj.name);
  return new types.Parameter(obj.name, obj.type, obj.value);
}

/**
 * Parse a list pf [[types.Parameter]] objects, checking its validity
 * @param obj parent object to parse
 * @param name field's parameter name
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseParameters(obj: any, name: string): types.Parameter[] {
  validation.validateParams(obj, name);
  const params: types.Parameter[] = [];
  for (const elem of obj[name]) {
    params.push(parseParameter(elem));
  }
  return params;
}

/**
 * Parse a generic object into an [[Invocation]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseInvocation(obj: any): types.Invocation {
  validation.validateIdentifier(obj, 'functionId');
  validation.validateCallbackUrl(obj);
  validation.validateCorrId(obj);
  validation.validateDoc(obj);
  validation.validateTimeout(obj);
  validation.validateSignature(obj);
  const inputs: types.Parameter[] = parseParameters(obj, 'inputs');
  const outputs: types.Parameter[] = parseParameters(obj, 'outputs');
  return new types.Invocation(obj.id, inputs, outputs, obj.callback, obj.corrId, obj.doc, obj.timeout, obj.signature);
}

/**
 * Parse a generic object into an [[EventSubscription]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseEventSubscription(obj: any): types.EventSubscription {
  validation.validateIdentifier(obj, 'eventId');
  validation.validateCallbackUrl(obj);
  validation.validateCorrId(obj);
  validation.validateDoc(obj);
  validation.validateFilter(obj);
  const params: types.Parameter[] = parseParameters(obj, 'params');
  return new types.EventSubscription(obj.eventId, params, obj.callback, obj.corrId, obj.doc, obj.filter);
}

/**
 * Parse a generic object into an [[FunctionSubscription]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseFunctionSubscription(obj: any): types.FunctionSubscription {
  validation.validateIdentifier(obj, 'functionId');
  validation.validateCallbackUrl(obj);
  validation.validateCorrId(obj);
  validation.validateDoc(obj);
  validation.validateFilter(obj);
  const params: types.Parameter[] = parseParameters(obj, 'params');
  return new types.FunctionSubscription(obj.functionId, params, obj.callback, obj.corrId, obj.doc, obj.filter);
}

/**
 * Parse a generic object into an [[types.EventUnsubscription]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseEventUnsubscription(obj: any): types.EventUnsubscription {
  validation.validateIdentifier(obj, 'eventId');
  validation.validateCorrId(obj);
  const params: types.Parameter[] = parseParameters(obj, 'params');
  return new types.EventUnsubscription(obj.eventId, params, obj.corrId);
}

/**
 * Parse a generic object into an [[types.FunctionUnsubscription]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseFunctionUnsubscription(obj: any): types.FunctionUnsubscription {
  validation.validateIdentifier(obj, 'functionId');
  validation.validateCorrId(obj);
  const params: types.Parameter[] = parseParameters(obj, 'params');
  return new types.FunctionUnsubscription(obj.functionId, params, obj.corrId);
}

/**
 * Parse a generic object into an [[types.EventQuery]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseEventQuery(obj: any): types.EventQuery {
  validation.validateIdentifier(obj, 'eventId');
  validation.validateFilter(obj);
  validation.validateTime(obj, false, 'startTime');
  validation.validateTime(obj, false, 'endTime');
  const params: types.Parameter[] = parseParameters(obj, 'params');
  return new types.EventQuery(obj.functionId, params, obj.filter, obj.startTime, obj.endTime);
}

/**
 * Parse a generic object into an [[types.FunctionQuery]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseFunctionQuery(obj: any): types.FunctionQuery {
  validation.validateIdentifier(obj, 'functionId');
  validation.validateFilter(obj);
  validation.validateTime(obj, false, 'startTime');
  validation.validateTime(obj, false, 'endTime');
  const params: types.Parameter[] = parseParameters(obj, 'params');
  return new types.FunctionQuery(obj.functionId, params, obj.filter, obj.startTime, obj.endTime);
}

/**
 * Parse a generic object into an [[Callback]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseCallback(obj: any): types.Callback {
  validation.validateCorrId(obj);
  validation.validateTimestamp(obj);
  const params: types.Parameter[] = parseParameters(obj, 'params');
  return new types.Callback(params, obj.corrId, obj.timestamp);
}

/**
 * Parse a generic object into an [[Occurrence]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseOccurrence(occ: any): types.Occurrence {
  validation.validateTimestamp(occ);
  const params: types.Parameter[] = parseParameters(occ, 'params');
  return new types.Occurrence(params, occ.timestamp);
}

/**
 * Parse an array of generic objects into an array of [[Occurrence]] objects, if valid,
 * otherwise it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseOccurrences(obj: any[]): types.Occurrence[] {
  validation.validateOccurrences(obj);
  const res: types.Occurrence[] = [];
  for (const occ of obj) {
    res.push(parseOccurrence(occ));
  }
  return res;
}

/**
 * Parse a generic object into an [[QueryResult]] one, if valid, otherwise
 * it throws an error
 * @param obj object to parse
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
function parseQueryResult(obj: any): types.QueryResult {
  const occurrences: types.Occurrence[] = parseOccurrences(obj);
  return new types.QueryResult(occurrences);
}

/****************************************** SCIP Message parser ******************************************/

/** All possible SCIP messages */
export type ScipMessage =
  | types.ScipInvocation
  | types.ScipSubscription
  | types.ScipUnsubscription
  | types.ScipQuery
  | types.ScipCallback
  | types.ScipSuccess
  | types.ScipError;

/**
 * Try to parse an object into a Scip object
 * @param data object to parse
 * @returns specific [[ScipMessage]] instance if the input data is valid
 * @throws [[jsonrpc-lib.ErrorObject]] if data is invalid
 */
export function parse(data: any): ScipMessage {
  // start parsing the object into a general JsonRpc message
  const msg: JsonRpcMessage = parseJsonrpc(data) as JsonRpcMessage;

  // this will contain the specific instance of the Scip message to return
  let res: ScipMessage;

  if (msg instanceof JsonRpcRequest) {
    const params = msg.params;
    switch (msg.method) {
      case 'Invoke':
        res = new types.ScipInvocation(msg.id, parseInvocation(params));
        break;
      case 'Subscribe':
        let subParam: types.EventSubscription | types.FunctionSubscription;
        if (validation.hasOwnProperty.call(params, 'eventId')) {
          subParam = parseEventSubscription(params);
        } else if (validation.hasOwnProperty.call(params, 'functionId')) {
          subParam = parseFunctionSubscription(params);
        } else {
          throw types.ScipErrorObject.invalidRequest('Invalid identifier found, use "functionId" or "eventId');
        }
        res = new types.ScipSubscription(msg.id, subParam);
        break;
      case 'Unsubscribe':
        let unsubParam: types.EventUnsubscription | types.FunctionUnsubscription;
        if (validation.hasOwnProperty.call(params, 'eventId')) {
          unsubParam = parseEventUnsubscription(params);
        } else if (validation.hasOwnProperty.call(params, 'functionId')) {
          unsubParam = parseFunctionUnsubscription(params);
        } else {
          throw types.ScipErrorObject.invalidRequest('Invalid identifier found, use "functionId" or "eventId');
        }
        res = new types.ScipUnsubscription(msg.id, unsubParam);
        break;
      case 'Query':
        let queryParam: types.EventQuery | types.FunctionQuery;
        if (validation.hasOwnProperty.call(params, 'eventId')) {
          queryParam = parseEventQuery(params);
        } else if (validation.hasOwnProperty.call(params, 'functionId')) {
          queryParam = parseFunctionQuery(params);
        } else {
          throw types.ScipErrorObject.invalidRequest('Invalid identifier found, use "functionId" or "eventId');
        }
        res = new types.ScipQuery(msg.id, queryParam);
        break;
      default:
        throw types.ScipErrorObject.invalidRequest('The method is invalid!');
    }
  } else if (msg instanceof JsonRpcNotification) {
    // check whether it is a valid scip callback
    if (msg.method !== types.ScipCallback.validMethod) {
      // throw error, invalid method for callback
      throw types.ScipErrorObject.invalidRequest(
        `${msg.method} unsupported method for Callback message! Use ${types.ScipCallback.validMethod} instead.`,
      );
    }
    res = new types.ScipCallback(parseCallback(msg.params));
  } else if (msg instanceof JsonRpcSuccess) {
    // check whether it is a valid scip query result or a generic response
    try {
      const queryResult: types.QueryResult = parseQueryResult(msg.result);
      res = new types.ScipQueryResult(msg.id, queryResult);
    } catch (err) {
      res = new types.ScipSuccess(msg.id, msg.result);
    }
  } else if (msg instanceof JsonRpcError) {
    // it is a generic json rpc error
    res = new types.ScipError(msg.id, new types.ScipErrorObject(msg.error.code, msg.error.message, msg.error.data));
  } else {
    // throw error, this shouldn't happen
    throw types.ScipErrorObject.parseError('Invalid message!');
  }

  return res;
}

/******************************************** SCIP Functions ********************************************/

/**
 * Generate a new Invoke method scip request message
 * @param id jsorpc request id
 * @param params jsonrpc request params, which can be either an [[Invocation]] object or a generic one
 */
export function invoke(id: Id, params: any): types.ScipInvocation {
  const obj = params instanceof types.Invocation ? params : parseInvocation(params);
  return new types.ScipInvocation(id, obj);
}

/**
 * Generate a new Subscribe method scip request message, focused on events
 * @param id jsorpc request id
 * @param params jsonrpc request params, which can be either an [[EventSubscription]] object or a generic one
 */
export function subscribeEvent(id: Id, params: any): types.ScipSubscription {
  const obj = params instanceof types.EventSubscription ? params : parseEventSubscription(params);
  return new types.ScipSubscription(id, obj);
}

/**
 * Generate a new Subscribe method scip request message, focused on functions
 * @param id jsorpc request id
 * @param params jsonrpc request params, which can be either an [[FunctionSubscription]] object or a generic one
 */
export function subscribeFunction(id: Id, params: any): types.ScipSubscription {
  const obj = params instanceof types.FunctionSubscription ? params : parseFunctionSubscription(params);
  return new types.ScipSubscription(id, obj);
}

/**
 * Generate a new Unsubscribe method scip request message, focused on events
 * @param id jsorpc request id
 * @param params jsonrpc request params, which can be either an [[EventUnsubscription]] object or a generic one
 */
export function unsubscribeEvent(id: Id, params: any): types.ScipUnsubscription {
  const obj = params instanceof types.EventUnsubscription ? params : parseEventUnsubscription(params);
  return new types.ScipUnsubscription(id, obj);
}

/**
 * Generate a new Unsubscribe method scip request message, focused on functions
 * @param id jsorpc request id
 * @param params jsonrpc request params, which can be either an [[FunctionUnsubscription]] object or a generic one
 */
export function unsubscribeFunction(id: Id, params: any): types.ScipUnsubscription {
  const obj = params instanceof types.FunctionUnsubscription ? params : parseFunctionUnsubscription(params);
  return new types.ScipUnsubscription(id, obj);
}

/**
 * Generate a new Query method scip request message, focused on events
 * @param id jsorpc request id
 * @param params jsonrpc request params, which can be either an [[EventQuery]] object or a generic one
 */
export function queryEvent(id: Id, params: any): types.ScipQuery {
  const obj = params instanceof types.EventQuery ? params : parseEventQuery(params);
  return new types.ScipQuery(id, obj);
}

/**
 * Generate a new Query method scip request message, focused on functions
 * @param id jsorpc request id
 * @param params jsonrpc request params, which can be either an [[FunctionQuery]] object or a generic one
 */
export function queryFunction(id: Id, params: any): types.ScipQuery {
  const obj = params instanceof types.FunctionQuery ? params : parseFunctionQuery(params);
  return new types.ScipQuery(id, obj);
}

/********************************************* Exports *********************************************/

const scip = {
  invoke,
  subscribeEvent,
  subscribeFunction,
  unsubscribeEvent,
  unsubscribeFunction,
  queryEvent,
  queryFunction,
  parse,
};

export default scip;
export { scip };
export { types };
