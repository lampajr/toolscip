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
 * This module provides two categories of functions:
 *   * Utility: some helpful functions that can be used to infer the type of a generic object
 *   * Validation: several validity functions that are used to check the structure of generic objects
 */

import * as types from './types';

/********************************************** Utilities Function **********************************************/
/** Checks whether a value is an integer or not */
export const isInteger = Number.isInteger;

export const hasOwnProperty = Object.prototype.hasOwnProperty;

/** Check whether the value is a number or not */
export function isNumber(val: any): boolean {
  return typeof val === 'number';
}

/** Check whether the value is a string or not */
export function isString(val: any): boolean {
  return typeof val === 'string';
}

/** Check whether the value is an object or not */
export function isObject(val: any): boolean {
  return typeof val === 'object';
}

/** Checks whether the input string is in URL format */
function isUrl(str: string): boolean {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(str);
}

/********************************************* Validation Function *********************************************/

/**
 * Validates if the type is a valid scip abstract type
 * @param obj parent object
 * @param required if the parameters member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateType(obj: any, required = true): void {
  if (required && !hasOwnProperty.call(obj, 'type')) {
    throw types.ScipErrorObject.parseError("A parameter MUST have a 'type' member!");
  }

  if (hasOwnProperty.call(obj, 'type')) {
    const type = obj.type;
    if (!isString(type)) {
      throw types.ScipErrorObject.parseError("Parameter's type MUST be of string type!");
    }
    // if (!isObject(type)) {
    //   throw types.ScipErrorObject.parseError("Parameter's type MUST be an object!");
    // }
    // if (!hasOwnProperty.call(type, 'type')) {
    //   throw types.ScipErrorObject.parseError("A parameter's type MUST have an inner 'type' field, but it is missing!");
    // }
  }
}

/**
 * Validate the parameters member of an object
 * @param obj parent object
 * @param required if the parameters member is required or not
 * @param name parameters type: 'inputs', 'outputs' or generic 'parameters'
 * @throws [[ErrorObject]] Parse Error
 */
export function validateParams(obj: any, name: string, required: boolean = true): void {
  if (required && !hasOwnProperty.call(obj, name)) {
    throw types.ScipErrorObject.parseError(`${name} is missing, but it is required!`);
  }
  if (hasOwnProperty.call(obj, name) && !Array.isArray(obj[name])) {
    throw types.ScipErrorObject.parseError(`${name} member, if present, MUST be of array type!`);
  }
}

/**
 * Validate the name member of an parameter
 * @param obj parent object
 * @param required if the name member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateName(obj: any, required = true): void {
  if (required && !hasOwnProperty.call(obj, 'name')) {
    throw types.ScipErrorObject.parseError(`Name is missing, but it is required!`);
  }
  if (hasOwnProperty.call(obj, 'name') && !isString(obj.name)) {
    throw types.ScipErrorObject.parseError(`Name member, if present, MUST be of string type!`);
  }
}

/**
 * Validate the value member of an parameter
 * @param obj parent object
 * @param required if the value member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateValue(obj: any, required = true): void {
  if (required && !hasOwnProperty.call(obj, 'value')) {
    throw types.ScipErrorObject.parseError(`A parameter value is missing, but it is required!`);
  }
}

/**
 * Validate the single param object
 * @param param parameter object
 * @throws [[ErrorObject]] Parse Error
 */
export function validateParam(param: any): void {
  if (!hasOwnProperty.call(param, 'type')) {
    throw types.ScipErrorObject.parseError(`Parameter MUST have an abstract type (i.e. field "type")!`);
  } else {
    validateType(param.type);
  }
  if (!hasOwnProperty.call(param, 'name') || !isString(param.name)) {
    throw types.ScipErrorObject.parseError(`Parameter MUST have a string name!`);
  }
}

/**
 * Validate the occurrences member of an object
 * @param obj parent object
 * @param required if the occurrences member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateOccurrences(obj: any, required = true): void {
  if (required && !hasOwnProperty.call(obj, 'occurrences')) {
    throw types.ScipErrorObject.parseError(`Occurrences member is missing, but it is required!`);
  }
  if (hasOwnProperty.call(obj, 'occurrences') && !Array.isArray(obj.occurrences)) {
    throw types.ScipErrorObject.parseError(`Occurrences member, if present, MUST be of array type!`);
  }
}

/**
 * Checks if the object has valid identifier, either function or event
 * @param obj object to validate
 * @param name name of the field's identifier, default 'functionIdentifier'
 * @throws [[ErrorObject]] Parse Error
 */
export function validateIdentifier(obj: any, name = 'functionIdentifier'): void {
  if (!hasOwnProperty.call(obj, name)) {
    throw types.ScipErrorObject.parseError(`The ${name} is missing, but it is required!`);
  }
  if (!isString(obj[name])) {
    throw types.ScipErrorObject.parseError('The identifier MUST be of string type!');
  }
}

/**
 * Validate the correlation identifier
 * @param obj parent object
 * @param required if the corrId member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateCorrId(obj: any, required = false): void {
  if (required && !hasOwnProperty.call(obj, 'corrId')) {
    throw types.ScipErrorObject.parseError('Correlation identifier is missing, but it is required!');
  }
  if (hasOwnProperty.call(obj, 'corrId') && !isString(obj.corrId)) {
    throw types.ScipErrorObject.parseError('Correlation identifier, if present, MUST be of string type!');
  }
}

/**
 * Validate the degree of confidence of an object
 * @param obj parent object
 * @param required if the doc member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateDoc(obj: any, required = false): void {
  if (required && !hasOwnProperty.call(obj, 'doc')) {
    throw types.ScipErrorObject.parseError('Degree of confidence is missing, but it is required!');
  }
  if (hasOwnProperty.call(obj, 'doc') && !isNumber(obj.doc)) {
    throw types.ScipErrorObject.parseError('Degree of confidence, if present, MUST be of number type!');
  }
}

/**
 * Validate the callback url of an object
 * @param obj parent object
 * @param required if the callback member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateCallbackUrl(obj: any, required = false): void {
  if (required && !hasOwnProperty.call(obj, 'callback')) {
    throw types.ScipErrorObject.parseError('Callback URL is missing, but it is required!');
  }
  if (hasOwnProperty.call(obj, 'doc') && (!isString(obj.callback) || !isUrl(obj.callback))) {
    throw types.ScipErrorObject.parseError('Callback URL, if present, MUST be of string type and a valid URL!');
  }
}

/**
 * Validate the filter of an object
 * @param obj parent object
 * @param required if the filter member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateFilter(obj: any, required = false): void {
  if (required && !hasOwnProperty.call(obj, 'filter')) {
    throw types.ScipErrorObject.parseError('Filter is missing, but it is required!');
  }
  if (hasOwnProperty.call(obj, 'filter') && !isString(obj.filter)) {
    throw types.ScipErrorObject.parseError('The filter, if present, MUST be of string type!');
  }
}

/**
 * Validate the timeout of an object
 * @param obj parent object
 * @param required if the timeout member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateTimeout(obj: any, required = false): void {
  if (required && !hasOwnProperty.call(obj, 'timeout')) {
    throw types.ScipErrorObject.parseError('Timeout is missing, but it is required!');
  }
  if (hasOwnProperty.call(obj, 'timeout') && !isInteger(obj.timeout)) {
    throw types.ScipErrorObject.parseError('The timeout, if present, MUST be of integer type!');
  }
}

/**
 * Validate the signature of an object
 * @param obj parent object
 * @param required if the signature member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateSignature(obj: any, required = false): void {
  if (required && !hasOwnProperty.call(obj, 'signature')) {
    throw types.ScipErrorObject.parseError('Signature is missing, but it is required!');
  }
  if (hasOwnProperty.call(obj, 'signature') && !isString(obj.signature)) {
    throw types.ScipErrorObject.parseError('The signature, if present, MUST be of string type!');
  }
}

/**
 * Validate the timeframe of an object
 * @param obj parent object
 * @param required if the timeframe member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateTimeframe(obj: any, required = false): void {
  if (required && !hasOwnProperty.call(obj, 'timeframe')) {
    throw types.ScipErrorObject.parseError('Timeframe is missing, but it is required!');
  }
  if (hasOwnProperty.call(obj, 'timeframe')) {
    if (!hasOwnProperty.call(obj.timeframe, 'from') || !hasOwnProperty.call(obj.timeframe, 'to')) {
      throw types.ScipErrorObject.parseError(`Timeframe invalid structure, it must have "from" and "to" properties!`);
    }
    if (!isString(obj.timeframe.from) || !isString(obj.timeframe.to)) {
      throw types.ScipErrorObject.parseError(`Timeframe properties "from" and "to" MUST be of string type!`);
    }
  }
}

/**
 * Validate the isoTimestamp of an object
 * @param obj parent object
 * @param required if the isoTimestamp member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateTimestamp(obj: any, required = false): void {
  if (required && !hasOwnProperty.call(obj, 'isoTimestamp')) {
    throw types.ScipErrorObject.parseError(`Timestamp is missing, but it is required!`);
  }
  if (hasOwnProperty.call(obj, 'isoTimestamp') && !isString(obj.isoTimestamp)) {
    throw types.ScipErrorObject.parseError(`The isoTimestamp, if present, MUST be of string type!`);
  }
}

/**
 * Validate the code of an error object
 * @param obj parent object
 * @param required if the code member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateErrorCode(obj: any, required = true): void {
  if (required && !hasOwnProperty.call(obj, 'code')) {
    throw types.ScipErrorObject.parseError(`Error code is missing, but it is required!`);
  }
  if (hasOwnProperty.call(obj, 'code') && (!isInteger(obj.code) || obj.code > 0)) {
    throw types.ScipErrorObject.parseError(`The error code, if present, MUST be a negative integer!`);
  }
}

/**
 * Validate the message of an error object
 * @param obj parent object
 * @param required if the message member is required or not
 * @throws [[ErrorObject]] Parse Error
 */
export function validateErrorMessage(obj: any, required = true): void {
  if (required && !hasOwnProperty.call(obj, 'message')) {
    throw types.ScipErrorObject.parseError(`Error message is missing, but it is required!`);
  }
  if (hasOwnProperty.call(obj, 'message') && !isString(obj.message)) {
    throw types.ScipErrorObject.parseError(`The error message, if present, MUST be of string type!`);
  }
}
