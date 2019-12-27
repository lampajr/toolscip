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
import { join } from 'path';
import { Contract, Method, Event } from '@toolscip/scdl-lib';
import { Config, loadConfig, getDescriptor, write } from '../utils';
import shared from '../shared';

export default class Query extends Command {
  static description = 'query past event occurences or function invocations';

  static flags = {
    help: flags.help({ char: 'h', description: `show query command help` }),
    path: shared.path,
    auth: shared.auth,
    jsonrpc: shared.jsonrpc,
    contract: shared.contract,
    method: shared.method,
    event: shared.event,
    val: shared.value,
    filter: shared.filter,
    startTime: shared.startTime,
    endTime: shared.endTime,
    file: shared.file,
  };

  async run() {
    const { flags } = this.parse(Query);

    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, 'scdl');

    const filename: string = flags.contract + '.json';
    const descriptor = await getDescriptor(filename, descriptorsFolder);

    if (!flags.method && !flags.event) {
      throw new CLIError(`You MUST provide 'function' or 'event' name!`);
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
          .query(
            flags.jsonrpc,
            flags.method ? flags.method : (flags.event as string),
            flags.val !== undefined ? flags.val : [],
            flags.filter,
            flags.startTime,
            flags.endTime,
          )
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
