import ajv from 'ajv';
import axios, { AxiosResponse } from 'axios';
import { ScdlSchema, ISCDL, IParameter } from './scdl';
import { ScipMessage, types } from '@lampajr/scip-lib';
import { Id } from '@lampajr/jsonrpc-lib';

const SCDL = 'scdl';
const AJV = new ajv().addSchema(ScdlSchema, SCDL);

/**
 * ValidationError class that is thrown whenever
 * the descriptor valdiation fails, it contains
 * a list of error messages.
 */
export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super(errors[0]);
    Object.setPrototypeOf(this, ValidationError);
  }
}

export class InvalidRequest extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidRequest);
  }
}

/**
 * Generic class that must be implemented by those objects
 * that perform http requests toward a SCIP gateway.
 */
export class Callable {
  constructor(public scl: string, private authorization?: string) {}

  /**
   * Generates and returns an Axios request
   * @param params allowed Smart Contract Invocation Protocol message
   * @returns an Axios promise response
   */
  public request(params: ScipMessage): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>> {
    return axios.post(this.scl, params);
  }
}

/**
 * Generic interface of a queryable object,
 * it provides a single method called 'query' used
 * to query past event occurrences or function
 * invocations.
 */
export interface Queryable {
  query(
    jsonrpcId: Id,
    id: string,
    values: any[],
    filter?: string,
    startTime?: string,
    endTime?: string,
  ): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>>;
}

/**
 * Generic interface of a subscribable object,
 * it provides two different methods: 'subscribe'
 * and 'unsubscribe' that are used for an event/function
 * subscription or unsubscription respectively.
 */
export interface Subscribable {
  subscribe(
    jsonrpcId: Id,
    id: string,
    values: any[],
    callback: string,
    corrId?: string,
    doc?: number,
    filter?: string,
  ): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>>;
  unsubscribe(jsonrpcId: Id, id: string, corrId?: string): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>>;
}

/**
 * Generic interface of an invocable object,
 * it provides a single method called 'invoke' used
 * to invoke a specific smart contract's function.
 */
export interface Invocable {
  invoke(
    jsonrpcId: Id,
    id: string,
    values: any[],
    signature: string,
    callback?: string,
    corrId?: string,
    doc?: number,
    timeout?: number,
  ): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>>;
}

/**
 * Creates a new [[Parameter]] array assigning for each of them its corresponding value
 * @param values array of values
 * @param prevParams array of [[IParameter]] objects
 * @returns array of [[Parameter]] objects
 * @throws [[InvalidRequest]] if the lengths mismatch
 */
export function createParams(values: any[], prevParams: IParameter[]): types.Parameter[] {
  if (values.length !== prevParams.length) {
    // checks whether there is a length mismatch between input params and input values
    throw new InvalidRequest(
      `The number of passed values mismatch the number of required parameters! [#${prevParams.length}]`,
    );
  }
  // create input params objects with their values
  const params: types.Parameter[] = [];
  for (let index = 0; index < values.length; index++) {
    const element: IParameter = prevParams[index];
    params.push(new types.Parameter(element.name, element.type, values[index]));
  }
  return params;
}

/**
 * Converts an array of [[IParameter]] into an array of [[Parameter]] objects
 * @param prevParams [[IParameter]] array
 * @returns the converted array
 */
export function convertParams(prevParams: IParameter[]): types.Parameter[] {
  return prevParams.map(elem => new types.Parameter(elem.name, elem.type));
}

/**
 * Validates the descriptor object using a JSON Schema validator
 * based on the SCDL schema [[ScdlSchema]]
 * @param data descriptor to validate
 * @returns the descriptor as [[ISCDL]] object
 * @throws [[ValidationError]] containing a list of error messages
 */
export function validate(data: any): ISCDL {
  const res = AJV.validate(SCDL, data);
  if (!res) {
    const errors = AJV.errors;
    if (errors !== undefined && errors !== null) {
      throw new ValidationError(errors.map(value => `${value.dataPath} ${value.message}`));
    } else {
      throw new ValidationError(['Unknown error!']);
    }
  }
  return data as ISCDL;
}

const utils = {
  validate,
  ValidationError,
  InvalidRequest,
  Callable,
  createParams,
  convertParams,
};

export default utils;
export { utils };
