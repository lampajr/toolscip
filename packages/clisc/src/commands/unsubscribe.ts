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
import Command from '../base';
import { getDescriptor, write } from '../utils';
import shared from '../shared';

export default class Unsubscribe extends Command {
  static description = `stop live monitoring of a smart contract's function or event by unsubscribing a previous subscription.`;

  static flags = {
    ...Command.flags,
    help: flags.help({ char: 'h', description: `show unsubscribe command help` }),
    auth: shared.auth,
    jsonrpc: shared.jsonrpc,
    contract: shared.contract,
    method: shared.method,
    event: shared.event,
    val: shared.value,
    corrId: shared.corrId,
    file: shared.file,
  };

  async run() {
    const { flags } = this.parse(Unsubscribe);

    if (this.cliscConfig === undefined || this.descriptorsFolder === undefined) {
      throw new CLIError('Unable to load the clisc configuration file!');
    }

    const filename: string = flags.contract + '.json';
    const descriptor = await getDescriptor(filename, this.descriptorsFolder);

    if (!flags.method && !flags.event) {
      throw new CLIError(`You MUST provide 'method' or 'event' flag!`);
    } else {
      try {
        // creates the contract object starting from the descriptor
        const contract: Contract = new Contract(descriptor, flags.auth);
        // retrieve the function/event to subscribe
        const attribute: Method | Event = flags.method
          ? contract.methods[flags.method]
          : contract.events[flags.event as string];

        if (attribute === undefined) {
          throw new CLIError(
            `${flags.method ? "Method name '" + flags.method : "Event named'" + flags.event}" not found in '${
              contract.descriptor.name
            }' contract\nThis contract has the following available ${
              flags.method ? 'methods: [' + Object.keys(contract.methods) : 'events: [' + Object.keys(contract.events)
            }]`,
          );
        }
        attribute
          .unsubscribe(flags.jsonrpc, flags.method ? flags.method : (flags.event as string), flags.corrId)
          .then(res => {
            write(res.data);
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
