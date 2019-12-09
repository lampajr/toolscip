import { AxiosResponse } from 'axios';
import { types } from '@lampajr/scip-lib';
import utils, { Invocable, Subscribable, Queryable } from './utils';
import { ISCDL, IFunction, IEvent } from './scdl';

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

/**
 * This object represents a single smart contract's function
 * that allows user to interact with it performing specific
 * SCIP requests (i.e. invocatoin, subscription, unsubscription and query).
 */
export class Method extends utils.Callable implements Invocable, Subscribable, Queryable {
  constructor(private data: IFunction, scl: string, authorization?: string) {
    super(scl, authorization);
  }

  invoke(params: types.ScipInvocation): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>> {
    return this.request(params);
  }

  subscribe(params: types.ScipSubscription): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>> {
    if (!(params.params instanceof types.FunctionSubscription)) {
      throw new utils.InvalidRequest('The params member of the request MUST be of FunctionSubscription');
    }
    return this.request(params);
  }

  unsubscribe(params: types.ScipUnsubscription): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>> {
    if (!(params.params instanceof types.FunctionUnsubscription)) {
      throw new utils.InvalidRequest('The params member of the request MUST be of FunctionUnsubscription');
    }
    return this.request(params);
  }

  query(params: types.ScipQuery): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>> {
    if (!(params.params instanceof types.FunctionQuery)) {
      throw new utils.InvalidRequest('The params member of the request MUST be of FunctionQuery');
    }
    return this.request(params);
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

  subscribe(params: types.ScipSubscription): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>> {
    if (!(params.params instanceof types.EventSubscription)) {
      throw new utils.InvalidRequest('The params member of the request MUST be of EventSubscription');
    }
    return this.request(params);
  }

  unsubscribe(params: types.ScipUnsubscription): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>> {
    if (!(params.params instanceof types.EventUnsubscription)) {
      throw new utils.InvalidRequest('The params member of the request MUST be of EventUnsubscription');
    }
    return this.request(params);
  }

  query(params: types.ScipQuery): Promise<AxiosResponse<types.ScipSuccess | types.ScipError>> {
    if (!(params.params instanceof types.EventQuery)) {
      throw new utils.InvalidRequest('The params member of the request MUST be of EventQuery');
    }
    return this.request(params);
  }
}
