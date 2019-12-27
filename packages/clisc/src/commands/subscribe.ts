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
import { CLIError } from '@oclif/errors';
import { Contract, Method, Event } from '@toolscip/scdl-lib';
import BaseCommand from '../base';
import { getDescriptor } from '../utils';
import shared from '../shared';

export default class Subscribe extends BaseCommand {
  static description = `monitor a target smart contract's function invocations or event occurrences starting from a smart contract's descriptor.`;

  static flags = {
    ...BaseCommand.flags,
    help: flags.help({ char: 'h', description: `show subscribe command help` }),
    auth: shared.auth,
    jsonrpc: shared.jsonrpc,
    contract: shared.contract,
    method: shared.method,
    event: shared.event,
    value: shared.value,
    callback: shared.callback,
    corrId: shared.corrId,
    doc: shared.doc,
    filter: shared.filter,
    file: shared.file,
  };

  async run() {
    if (this.cliscConfig === undefined || this.descriptorsFolder === undefined) {
      throw new CLIError('Unable to load the clisc configuration file!');
    }

    const filename: string = this.flags.contract + '.json';
    const descriptor = await getDescriptor(filename, this.descriptorsFolder);

    if (this.flags.callback === undefined) {
      throw new CLIError(
        `You MUST set a callback to which the gateway will send the async responses. Use flag '--calback' or '-u'`,
      );
    }

    if (!this.flags.method && !this.flags.event) {
      throw new CLIError(`You MUST provide 'function' or 'event' flag!`);
    } else {
      try {
        // creates the contract object starting from the descriptor
        const contract: Contract = new Contract(descriptor, this.flags.auth);
        // retrieve the function/event to subscribe
        const attribute: Method | Event = this.flags.method
          ? contract.methods[this.flags.method]
          : contract.events[this.flags.event as string];

        if (attribute === undefined) {
          throw new CLIError(
            `${
              this.flags.method ? "Method name '" + this.flags.method : "Event named'" + this.flags.event
            }" not found in '${contract.descriptor.name}' contract\nThis contract has the following available ${
              this.flags.method
                ? 'methods: [' + Object.keys(contract.methods)
                : 'events: [' + Object.keys(contract.events)
            }]`,
          );
        }
        attribute
          .subscribe(
            this.flags.jsonrpc,
            this.flags.method ? this.flags.method : (this.flags.event as string),
            this.flags.value !== undefined ? this.flags.value : [],
            this.flags.callback,
            this.flags.corrId,
            this.flags.doc,
            this.flags.filter,
          )
          .then(res => {
            this.log(res.data);
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
