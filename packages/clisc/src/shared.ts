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

import { flags } from '@oclif/command';

const path = flags.string({
  char: 'p',
  description: 'provide a path where the config files are located, if not set, the current directory is used',
});

const auth = flags.string({
  char: 'a',
  description: 'authorization token',
});

const jsonrpc = flags.string({
  char: 'j',
  description: 'jsonrpc request identifier',
  required: true,
});

const method = flags.string({
  char: 'm',
  description: `(required) name of the request's target function/method`,
});

const event = flags.string({
  char: 'e',
  description: `(required) name of the request's target event`,
});

const value = flags.string({
  char: 'v',
  description: `target function or event parameter's value, if more than one value is required you can set this flag multiple times (the order is important!)`,
  multiple: true,
});

const callback = flags.string({
  char: 'u',
  description: 'callback URL to which the gateway will send all asynchronous responses',
});

const corrId = flags.string({
  char: 'i',
  description: 'client-provided correlation identifier',
});

const doc = flags.integer({
  char: 'd',
  description: `degree of confidence's value`,
});

const timeout = flags.integer({
  char: 't',
  description: 'timeout that the gateway have to wait before block the operation',
});

const signature = flags.string({
  char: 's',
  description: `cryptographic hash function's name that has to be used to sign the request`,
  default: 'sha256',
});

const filter = flags.string({
  char: 'f',
  description: 'C-style boolean expression over function/event parameters',
});

const startTime = flags.string({
  char: 's',
  description: 'start time from which start considering event occurrences or function invocations',
});

const endTime = flags.string({
  char: 'd',
  description: 'end time from which stop considering event occurrences or function invocations',
});

const file = flags.string({
  char: 'F',
  description: 'path to a JSON file that contains all required parameter for the specific request',
  exclusive: [
    'endTime',
    'startTime',
    'filter',
    'signature',
    'timeout',
    'doc',
    'corrId',
    'callback',
    'value',
    'event',
    'method',
  ],
});

const shared = {
  path,
  auth,
  jsonrpc,
  method,
  event,
  value,
  callback,
  corrId,
  doc,
  timeout,
  signature,
  filter,
  startTime,
  endTime,
  file,
};

export default shared;
