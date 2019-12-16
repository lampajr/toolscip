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

import { Command, flags } from '@oclif/command';
import { CLIError } from '@oclif/errors';
import { Config, loadConfig, getDescriptor } from '../utils';
import { join } from 'path';
import { Contract, Method, Event } from '@lampajr/scdl-lib';

export default class Subscribe extends Command {
  static description = `Command used to monitor a target smart contract's function invocations or event occurrences starting from a smart contract's descriptor.`;

  static flags = {
    help: flags.help({ char: 'h', description: `show subscribe command help` }),
    path: flags.string({
      char: 'p',
      description: 'provide a path where the config files are located, if not set, the current dir is used',
    }),
    format: flags.string({ char: 'F', description: 'descriptor format', default: 'scdl' }),
    auth: flags.string({ char: 'a', description: 'authorization token' }),
    jsonrpc: flags.string({ char: 'j', description: 'jsonrpc request identifier', required: true }),
    contract: flags.string({ char: 'c', description: `contract's name`, required: true }),
    function: flags.string({ char: 'f', description: `name of the function to subscribe`, exclusive: ['event'] }),
    event: flags.string({ char: 'e', description: `name of the event to subscribe`, exclusive: ['function'] }),
    val: flags.string({
      char: 'v',
      description:
        'value to be passed as parameter to the function, if more than one value is required you can set this flag multiple times',
      multiple: true,
    }),
    callback: flags.string({
      char: 'u',
      description: 'callback URL to which the gateway will forward all asynchronous responses',
      required: true,
    }),
    corrId: flags.string({ char: 'i', description: 'client-provided correlation identifier' }),
    doc: flags.integer({ char: 'd', description: 'degree of confidence' }),
    filter: flags.string({ char: 't', description: 'C-style boolean expression over function/event parameters' }),
  };

  async run() {
    const { flags } = this.parse(Subscribe);

    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, flags.format);

    const filename: string = flags.contract + '.json';
    const descriptor = await getDescriptor(filename, descriptorsFolder);

    if (!flags.function && !flags.event) {
      throw new CLIError(`You MUST provide 'function' or 'event' flag!`);
    } else {
      try {
        // creates the contract object starting from the descriptor
        const contract: Contract = new Contract(descriptor, flags.auth);
        // retrieve the function/event to subscribe
        const attribute: Method | Event = flags.function
          ? contract.methods[flags.function]
          : contract.events[flags.event as string];

        if (attribute === undefined) {
          throw new CLIError(
            `${flags.function ? "Method name '" + flags.function : "Event named'" + flags.event}" not found in '${
              contract.descriptor.name
            }' contract\nThis contract has the following available ${
              flags.function ? 'methods: [' + Object.keys(contract.methods) : 'events: [' + Object.keys(contract.events)
            }]`,
          );
        }
        attribute
          .subscribe(
            flags.jsonrpc,
            flags.function ? flags.function : (flags.event as string),
            flags.val !== undefined ? flags.val : [],
            flags.callback,
            flags.corrId,
            flags.doc,
            flags.filter,
          )
          .then(res => {
            console.log(res.data);
          })
          .catch(err => {
            console.error(err);
          });
      } catch (err) {
        if (err instanceof CLIError) {
          throw err;
        }
        throw new CLIError(err.message);
      }
    }
  }
}
