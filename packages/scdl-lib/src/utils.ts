import ajv from 'ajv';
import axios, { AxiosResponse } from 'axios';
import { ScdlSchema, ISCDL } from './scdl';
import { ScipMessage } from '@lampajr/scip-lib';
import { types } from '@lampajr/scip-lib';

const SCDL: string = 'scdl';
const AJV = new ajv().addSchema(ScdlSchema, SCDL);

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
  query(params: types.ScipQuery): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>>;
}

/**
 * Generic interface of a subscribable object,
 * it provides two different methods: 'subscribe'
 * and 'unsubscribe' that are used for an event/function
 * subscription or unsubscription respectively.
 */
export interface Subscribable {
  subscribe(params: types.ScipSubscription): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>>;
  unsubscribe(params: types.ScipUnsubscription): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>>;
}

/**
 * Generic interface of an invocable object,
 * it provides a single method called 'invoke' used
 * to invoke a specific smart contract's function.
 */
export interface Invocable {
  invoke(params: types.ScipInvocation): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>>;
}

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
};

export default utils;
export { utils };
