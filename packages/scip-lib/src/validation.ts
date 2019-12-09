import * as types from './types';
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
 * @param absType type to validate
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateAbsType(absType: any): void {
  try {
    JSON.parse(absType);
  } catch (err) {
    throw types.ScipErrorObject.parseError(`Abstract type JSON parsing error: ${err.message}`);
  }
  if (!isObject(absType)) {
    throw types.ScipErrorObject.parseError('Abstract type MUST be an object!');
  }
  if (!hasOwnProperty.call(absType, 'type')) {
    throw types.ScipErrorObject.parseError('Type field is missing, but it is required!');
  }
}

/**
 * Validate the params member of an object
 * @param obj parent object
 * @param required if the params member is required or not
 * @param name params type: 'inputs', 'outputs' or generic 'params'
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateParams(obj: any, name: string = '', required: boolean = true): void {
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
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateName(obj: any, required: boolean = true): void {
  if (required && !hasOwnProperty.call(obj, 'name')) {
    throw types.ScipErrorObject.parseError(`Name is missing, but it is required!`);
  }
  if (hasOwnProperty.call(obj, 'name') && !isString(obj.name)) {
    throw types.ScipErrorObject.parseError(`Name member, if present, MUST be of string type!`);
  }
}

/**
 * Validate the single param object
 * @param param parameter object
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateParam(param: any): void {
  if (!hasOwnProperty.call(param, 'type')) {
    throw types.ScipErrorObject.parseError(`Parameter MUST have an abstract type (i.e. field "type")!`);
  } else {
    validateAbsType(param.type);
  }
  if (!hasOwnProperty.call(param, 'name') || !isString(param.name)) {
    throw types.ScipErrorObject.parseError(`Parameter MUST have a string name!`);
  }
}

/**
 * Validate the occurrences member of an object
 * @param obj parent object
 * @param required if the occurrences member is required or not
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateOccurrences(obj: any, required: boolean = true): void {
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
 * @param name name of the field's identifier, default 'functionId'
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateIdentifier(obj: any, name: string = 'functionId'): void {
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
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateCorrId(obj: any, required: boolean = false): void {
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
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateDoc(obj: any, required: boolean = false): void {
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
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateCallbackUrl(obj: any, required: boolean = false): void {
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
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateFilter(obj: any, required: boolean = false): void {
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
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateTimeout(obj: any, required: boolean = false): void {
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
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateSignature(obj: any, required: boolean = false): void {
  if (required && !hasOwnProperty.call(obj, 'signature')) {
    throw types.ScipErrorObject.parseError('Signature is missing, but it is required!');
  }
  if (hasOwnProperty.call(obj, 'signature') && !isString(obj.signature)) {
    throw types.ScipErrorObject.parseError('The signature, if present, MUST be of string type!');
  }
}

/**
 * Validate the ISO time of an object, either startTime or endTime
 * @param obj parent object
 * @param required if the time member is required or not
 * @param name field's name, either 'startTime' (default) or 'endTime'
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateTime(obj: any, required: boolean = false, name: string = 'startTime'): void {
  if (required && !hasOwnProperty.call(obj, name)) {
    throw types.ScipErrorObject.parseError(`${name} is missing, but it is required!`);
  }
  if (hasOwnProperty.call(obj, name) && !isString(obj[name])) {
    throw types.ScipErrorObject.parseError(`The ${name}, if present, MUST be of string type!`);
  }
}

/**
 * Validate the timestamp of an object
 * @param obj parent object
 * @param required if the timestamp member is required or not
 * @param name field's name, either 'startTime' (default) or 'endTime'
 * @throws [[jsonrpc-lib.ErrorObject]] Parse Error
 */
export function validateTimestamp(obj: any, required: boolean = false): void {
  if (required && !hasOwnProperty.call(obj, 'timestamp')) {
    throw types.ScipErrorObject.parseError(`Timestamp is missing, but it is required!`);
  }
  if (hasOwnProperty.call(obj, 'timestamp') && !isString(obj.timestamp)) {
    throw types.ScipErrorObject.parseError(`The timestamp, if present, MUST be of string type!`);
  }
}
