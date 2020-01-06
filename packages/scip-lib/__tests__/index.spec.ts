import 'mocha';
import { expect } from 'chai';
import { parse, parseRequest, parseResponse, parseParams, invoke } from '../src/index';
import {
  ScipInvocation,
  ScipSubscription,
  EventSubscription,
  FunctionSubscription,
  ScipUnsubscription,
  EventUnsubscription,
  FunctionUnsubscription,
  ScipQuery,
  EventQuery,
  FunctionQuery,
  ScipCallback,
  Callback,
  Invocation,
  ScipSuccess,
  ScipError,
  ScipQueryResult,
  QueryResult,
  Parameter,
} from '../src/types';

describe('index.ts test', () => {
  describe('#parse', () => {
    /** Invalid JSON-RPC version */
    it('Should throw an error if an invalid jsonrpc version was used', () => {
      const data = {
        jsonrpc: '1.0',
        id: 'abcdefg',
        method: 'method',
        params: {},
      };
      try {
        parse(data);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('Version 1.0 not supported! Please use 2.0 instead.');
      }
    });

    it('Should throw an error if the method is an invalid SCIP one', () => {
      const data = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'method',
        params: {},
      };
      try {
        parse(data);
      } catch (err) {
        expect(err)
          .haveOwnProperty('data')
          .equal('The method is invalid!');
      }
    });

    /** ScipInvocation request */
    it('Should return a ScipInvocation instance with an Invocation param', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'Invoke',
        params: {
          functionId: 'send',
          inputs: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 23,
            },
          ],
          outputs: [],
          signature: 'abdf34b5..',
        },
      };
      expect(parse(msg))
        .to.be.instanceOf(ScipInvocation)
        .and.haveOwnProperty('params')
        .to.be.instanceOf(Invocation);
    });

    /** Event ScipSubscription request */
    it('Should return a ScipSubscription instance with an EventSubscription param', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'Subscribe',
        params: {
          eventId: 'Sent',
          params: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 23,
            },
          ],
          callback: 'https://localhost:3000',
        },
      };
      expect(parse(msg))
        .to.be.instanceOf(ScipSubscription)
        .and.haveOwnProperty('params')
        .to.be.instanceOf(EventSubscription);
    });

    /** Function ScipSubscription request */
    it('Should return a ScipSubscription instance with an FunctionSubscription param', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'Subscribe',
        params: {
          functionId: 'send',
          params: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 23,
            },
          ],
          callback: 'https://localhost:3000',
        },
      };
      expect(parse(msg))
        .to.be.instanceOf(ScipSubscription)
        .and.haveOwnProperty('params')
        .to.be.instanceOf(FunctionSubscription);
    });

    /** Event ScipUnsubscription request */
    it('Should return a ScipUnsubscription instance with an EventUnsubscription param', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'Unsubscribe',
        params: {
          eventId: 'Sent',
          params: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 23,
            },
          ],
        },
      };
      expect(parse(msg))
        .to.be.instanceOf(ScipUnsubscription)
        .and.haveOwnProperty('params')
        .to.be.instanceOf(EventUnsubscription);
    });

    /** Function ScipUnsubscription request */
    it('Should return a ScipUnsubscription instance with an FunctionUnsubscription param', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'Unsubscribe',
        params: {
          functionId: 'send',
          params: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 23,
            },
          ],
        },
      };
      expect(parse(msg))
        .to.be.instanceOf(ScipUnsubscription)
        .and.haveOwnProperty('params')
        .to.be.instanceOf(FunctionUnsubscription);
    });

    /** Event ScipQuery request */
    it('Should return a ScipQuery instance with an EventQuery param', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'Query',
        params: {
          eventId: 'Sent',
          params: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 23,
            },
          ],
        },
      };
      expect(parse(msg))
        .to.be.instanceOf(ScipQuery)
        .and.haveOwnProperty('params')
        .to.be.instanceOf(EventQuery);
    });

    /** Function ScipQuery request */
    it('Should return a ScipQuery instance with an FunctionQuery param', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'Query',
        params: {
          functionId: 'send',
          params: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 23,
            },
          ],
        },
      };
      expect(parse(msg))
        .to.be.instanceOf(ScipQuery)
        .and.haveOwnProperty('params')
        .to.be.instanceOf(FunctionQuery);
    });

    /** Asynchronous Callback notification */
    it('Should return a ScipCallback with a Callback param', () => {
      const msg = {
        jsonrpc: '2.0',
        method: 'ReceiveCallback',
        params: {
          timestamp: '4549834340',
          params: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 500,
            },
          ],
        },
      };
      expect(parse(msg))
        .to.be.instanceOf(ScipCallback)
        .and.haveOwnProperty('params')
        .to.be.instanceOf(Callback);
    });

    /** Generic synchronous Success response */
    it('Should return a ScipSuccess instance', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        result: 'OK',
      };
      expect(parse(msg)).to.be.instanceOf(ScipSuccess);
    });

    /** Synchronous Query result response */
    it('Should return a ScipQueryResult instance', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        result: {
          occurrences: [
            {
              timestamp: '3423672378',
              params: [
                {
                  name: 'from',
                  type: {
                    type: 'string',
                  },
                  value: '0xabdg456dfg234fd',
                },
                {
                  name: 'to',
                  type: {
                    type: 'string',
                  },
                  value: '0xabdg456dfg234fd',
                },
                {
                  name: 'amount',
                  type: {
                    type: 'number',
                  },
                  value: 500,
                },
              ],
            },
            {
              timestamp: '3623677399',
              params: [
                {
                  name: 'from',
                  type: {
                    type: 'string',
                  },
                  value: '0xabdg456dfg234g2',
                },
                {
                  name: 'to',
                  type: {
                    type: 'string',
                  },
                  value: '0xabdg456dfg76679',
                },
                {
                  name: 'amount',
                  type: {
                    type: 'number',
                  },
                  value: 326,
                },
              ],
            },
          ],
        },
      };
      expect(parse(msg))
        .to.be.instanceOf(ScipQueryResult)
        .and.haveOwnProperty('result')
        .to.be.instanceOf(QueryResult);
    });

    /** Generic synchronous Error response */
    it('Should return a ScipError instance', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        error: {
          code: -2335,
          message: 'Parse error',
          data: 'Missing required property',
        },
      };
      expect(parse(msg)).to.be.instanceOf(ScipError);
    });
  });

  describe('#parseRequest', () => {
    it('Should throw an error if trying to parse a response instead of a request', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        error: {
          code: -2335,
          message: 'Parse error',
          data: 'Missing required property',
        },
      };

      try {
        parseRequest(msg);
      } catch (err) {
        expect(err)
          .to.haveOwnProperty('data')
          .equal('The parsed data is not a valid scip request, obtained ScipError instead!');
      }
    });

    it('Should return the same result of #parse function if trying to parse a request', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'Invoke',
        params: {
          functionId: 'send',
          inputs: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 23,
            },
          ],
          outputs: [],
          signature: 'abdf34b5..',
        },
      };

      expect(parseRequest(msg)).to.be.eql(parse(msg));
      expect(parseRequest(msg).serialize()).to.be.equal(parse(msg).serialize());
    });
  });

  describe('#parseResponse', () => {
    it('Should throw an error if trying to parse a request instead of a response', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        method: 'Invoke',
        params: {
          functionId: 'send',
          inputs: [
            {
              name: 'from',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'to',
              type: {
                type: 'string',
              },
              value: '0xabdg456dfg234fd',
            },
            {
              name: 'amount',
              type: {
                type: 'number',
              },
              value: 23,
            },
          ],
          outputs: [],
          signature: 'abdf34b5..',
        },
      };

      try {
        parseResponse(msg);
      } catch (err) {
        expect(err)
          .to.haveOwnProperty('data')
          .equal('The parsed data is not a valid scip response, obtained ScipInvocation instead!');
      }
    });

    it('Should return the same result of #parse function if trying to parse a response', () => {
      const msg = {
        jsonrpc: '2.0',
        id: 'abcdefg',
        error: {
          code: -2335,
          message: 'Parse error',
          data: 'Missing required property',
        },
      };

      expect(parseResponse(msg)).to.be.eql(parse(msg));
      expect(parseResponse(msg).serialize()).to.be.equal(parse(msg).serialize());
    });
  });

  describe('#parseParams', () => {
    it('Should throw an error since a ScipErrorObject is not a valid request param', () => {
      const param = {
        code: -2335,
        message: 'Parse error',
        data: 'Missing required property',
      };
      expect(() => parseParams(param)).to.throw('Invalid params');
    });

    it('Should return an Invocation instance', () => {
      const param = {
        functionId: 'send',
        inputs: [
          {
            name: 'from',
            type: {
              type: 'string',
            },
            value: '0xabdg456dfg234fd',
          },
          {
            name: 'to',
            type: {
              type: 'string',
            },
            value: '0xabdg456dfg234fd',
          },
          {
            name: 'amount',
            type: {
              type: 'number',
            },
            value: 23,
          },
        ],
        outputs: [],
        signature: 'abdf34b5..',
      };
      expect(parseParams(param)).to.be.instanceOf(Invocation);
    });
  });

  describe('#invoke', () => {
    it('We should obtain the same object if we create a new ScipInvocation using a generic params or an Invocation instance', () => {
      const paramObj = {
        functionId: 'send',
        inputs: [
          {
            name: 'from',
            type: {
              type: 'string',
            },
            value: '0xabdg456dfg234fd',
          },
          {
            name: 'to',
            type: {
              type: 'string',
            },
            value: '0xabdg456dfg234fd',
          },
          {
            name: 'amount',
            type: {
              type: 'number',
            },
            value: 23,
          },
        ],
        outputs: [],
        signature: 'abdf34b5..',
      };

      const paramClass = new Invocation(
        'send',
        [
          new Parameter('from', { type: 'string' }, '0xabdg456dfg234fd'),
          new Parameter('to', { type: 'string' }, '0xabdg456dfg234fd'),
          new Parameter('amount', { type: 'number' }, 23),
        ],
        [],
        'abdf34b5..',
      );
      expect(invoke('abcdefg', paramObj)).to.be.eql(invoke('abcdefg', paramClass));
    });
  });

  // tslint:disable-next-line:no-empty
  describe('#subscribeEvent', () => {});

  // tslint:disable-next-line:no-empty
  describe('#subscribeFunction', () => {});

  // tslint:disable-next-line:no-empty
  describe('#unsubscribeEvent', () => {});

  // tslint:disable-next-line:no-empty
  describe('#unsubscribeFunction', () => {});

  // tslint:disable-next-line:no-empty
  describe('#queryEvent', () => {});

  // tslint:disable-next-line:no-empty
  describe('#queryFunction', () => {});

  // tslint:disable-next-line:no-empty
  describe('#success', () => {});

  // tslint:disable-next-line:no-empty
  describe('#error', () => {});

  // tslint:disable-next-line:no-empty
  describe('#callback', () => {});
});
