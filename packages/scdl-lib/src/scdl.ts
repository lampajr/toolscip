/** Smart Contract Description Language (SCDL) JSON Schema */
export const ScdlSchema = {
  properties: {
    scdl_version: { type: 'string' },
    name: { type: 'string' },
    version: { type: 'string' },
    author: { type: 'string' },
    description: { type: 'string' },
    latest_url: { type: 'string' },
    created_on: { type: 'string' },
    updated_on: { type: 'string' },
    scl: { type: 'string' },
    internal_address: { type: 'string' },
    blockchain_type: { type: 'string' },
    blockchain_version: { type: 'string' },
    metadata: { type: 'string' },
    hash: { type: 'string' },
    is_stateful: { type: 'boolean' },
    lifecycle: { type: 'string' },
    functions: {
      type: 'array',
      items: {
        $ref: '#/definitions/functionObj',
      },
    },
    events: {
      type: 'array',
      items: {
        $ref: '#/definitions/eventObj',
      },
    },
  },
  required: [],
  definitions: {
    functionObj: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        inputs: {
          type: 'array',
          items: { $ref: '#/definitions/parameterObj' },
        },
        outputs: {
          type: 'array',
          items: { $ref: '#/definitions/parameterObj' },
        },
        has_side_effects: { type: 'boolean' },
        scope: { type: 'string' },
        dispatcher: { type: 'string' },
        events: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name', 'inputs', 'outputs'],
    },
    eventObj: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        outputs: {
          type: 'array',
          items: { $ref: '#/definitions/parameterObj' },
        },
      },
      required: ['name', 'outputs'],
    },
    parameterObj: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'object' },
        is_indexed: { type: 'boolean' },
      },
      required: ['name', 'type'],
    },
  },
};

export interface IParameter {
  readonly name: string;
  readonly type: object;
  readonly is_indexed: boolean;
}

export interface IFunction {
  readonly name: string;
  readonly scope: string;
  readonly description: string;
  readonly dispatcher: string;
  readonly events: string[];
  readonly has_side_effects: boolean;
  readonly inputs: IParameter[];
  readonly outputs: IParameter[];
}

export interface IEvent {
  readonly name: string;
  readonly description: string;
  readonly outputs: IParameter[];
}

export interface ISCDL {
  readonly scdl_version: string;
  readonly name: string;
  readonly version: string;
  readonly author: string;
  readonly description: string;
  readonly created_on: string;
  readonly updated_on: string;
  readonly scl: string;
  readonly internal_address: string;
  readonly blockchain_type: string;
  readonly blockchain_version: string;
  readonly hash: string;
  readonly is_stateful: boolean;
  readonly lifecycle: string;
  readonly metadata: string;
  readonly latest_url: string;
  readonly functions: IFunction[];
  readonly events: IEvent[];
}
