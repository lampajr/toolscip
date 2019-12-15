/**
 * Copyright 2019-2020 Andrea Lamparelli
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
 */

import { AxiosResponse } from 'axios';
import {
  types,
  invoke,
  subscribeEvent,
  subscribeFunction,
  unsubscribeEvent,
  unsubscribeFunction,
  queryEvent,
  queryFunction,
} from '@lampajr/scip-lib';
import utils, { Invocable, Subscribable, Queryable, createParams, convertParams } from './utils';
import { ISCDL, IFunction, IEvent } from './scdl';
import { Id } from '@lampajr/jsonrpc-lib';

/**
 * This object represents a single smart contract's function
 * that allows user to interact with it performing specific
 * SCIP requests (i.e. invocatoin, subscription, unsubscription and query).
 */
export class Method extends utils.Callable implements Invocable, Subscribable, Queryable {
  constructor(private data: IFunction, scl: string, authorization?: string) {
    super(scl, authorization);
  }

  invoke(
    jsonrpcId: Id,
    id: string,
    values: any[],
    signature: string,
    callback?: string,
    corrId?: string,
    doc?: number,
    timeout?: number,
  ): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>> {
    // creates the input params objects
    const inputs: types.Parameter[] = createParams(values, this.data.inputs);
    // creates output params objects
    const outputs: types.Parameter[] = convertParams(this.data.outputs);

    // create SCIP [[Invocation]] param object
    const scipParams = new types.Invocation(id, inputs, outputs, signature, callback, corrId, doc, timeout);
    return this.request(invoke(jsonrpcId, scipParams));
  }

  subscribe(
    jsonrpcId: Id,
    id: string,
    values: any[],
    callback: string,
    corrId?: string | undefined,
    doc?: number | undefined,
    filter?: string | undefined,
  ): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>> {
    // creates the input params objects
    const params = createParams(values, this.data.inputs);

    // create SCIP [[FunctionSubscription]] param object
    const scipParams = new types.FunctionSubscription(id, params, callback, corrId, doc, filter);
    return this.request(subscribeFunction(jsonrpcId, scipParams));
  }

  unsubscribe(
    jsonrpcId: Id,
    id: string,
    corrId?: string | undefined,
  ): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>> {
    const params = convertParams(this.data.inputs);

    // create SCIP [[FunctionSubscription]] param object
    const scipParams = new types.FunctionUnsubscription(id, params, corrId);
    return this.request(unsubscribeFunction(jsonrpcId, scipParams));
  }

  query(
    jsonrpcId: Id,
    id: string,
    values: any[],
    filter?: string | undefined,
    startTime?: string | undefined,
    endTime?: string | undefined,
  ): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>> {
    // creates the input params objects
    const params = createParams(values, this.data.inputs);

    // create SCIP [[FunctionSubscription]] param object
    const scipParams = new types.FunctionQuery(id, params, filter, startTime, endTime);
    return this.request(queryFunction(jsonrpcId, scipParams));
  }
}

/**
 * This object represents a single smart contract's event
 * that allows user to interact with it performing specific
 * SCIP requests (i.e. subscription, unsubscription and query).
 */
export class Event extends utils.Callable implements Subscribable, Queryable {
  constructor(private data: IEvent, scl: string, authorization?: string) {
    super(scl, authorization);
  }

  subscribe(
    jsonrpcId: Id,
    id: string,
    values: any[],
    callback: string,
    corrId?: string | undefined,
    doc?: number | undefined,
    filter?: string | undefined,
  ): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>> {
    // creates the input params objects
    const params = createParams(values, this.data.outputs);

    // create SCIP [[EventSubscription]] param object
    const scipParams = new types.EventSubscription(id, params, callback, corrId, doc, filter);
    return this.request(subscribeEvent(jsonrpcId, scipParams));
  }

  unsubscribe(
    jsonrpcId: Id,
    id: string,
    corrId?: string | undefined,
  ): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>> {
    const params = convertParams(this.data.outputs);

    // create SCIP [[EventUnsubscription]] param object
    const scipParams = new types.EventUnsubscription(id, params, corrId);
    return this.request(unsubscribeEvent(jsonrpcId, scipParams));
  }

  query(
    jsonrpcId: Id,
    id: string,
    values: any[],
    filter?: string | undefined,
    startTime?: string | undefined,
    endTime?: string | undefined,
  ): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>> {
    // creates the input params objects
    const params = createParams(values, this.data.outputs);

    // create SCIP [[FunctionSubscription]] param object
    const scipParams = new types.EventQuery(id, params, filter, startTime, endTime);
    return this.request(queryEvent(jsonrpcId, scipParams));
  }
}

export class Contract {
  public metadata: any = {}; // is this needed?
  public methods: any = {};
  public events: any = {};
  public descriptor: ISCDL;

  /**
   * Generates a new Contract instance from an SCDL descriptor
   * @param descriptor scdl-based descriptor
   * @param authorization bearer token that may be required by the SCIP gateway
   * @throws [[ValidationError]] if the descriptor is not valid
   */
  constructor(descriptor: any, private authorization?: string) {
    // validates the scdl-based descriptor
    this.descriptor = utils.validate(descriptor);

    // Configure functions
    for (const method of this.descriptor.functions) {
      this.configMethod(method);
    }

    // Configure events
    for (const event of this.descriptor.events) {
      this.configEvent(event);
    }
  }

  /**
   * Updates the authorization token
   * @param auth new auth token
   */
  public updateAuth(auth: string): void {
    this.authorization = auth;
  }

  /**
   * Configure a single contract's method.
   * @param method SCDL function object
   */
  private configMethod(method: IFunction): void {
    Object.defineProperty(this.methods, method.name, {
      value: new Method(method, this.descriptor.scl, this.authorization),
      writable: false,
      enumerable: true,
    });
  }

  /**
   * Configure a single contract's event.
   * @param event SCDL function object
   */
  private configEvent(event: IEvent): void {
    Object.defineProperty(this.events, event.name, {
      value: new Event(event, this.descriptor.scl, this.authorization),
      writable: false,
      enumerable: true,
    });
  }
}

const scdl = {
  Method,
  Event,
  Contract,
};

export default scdl;
export { scdl };
