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
import { Method, Event } from '@toolscip/scdl-lib';
import { types, ScipRequest } from '@toolscip/scip-lib';
import ScipCommand from '../scip';
import shared from '../shared';

export default class Query extends ScipCommand {
  static description = 'query past event occurences or function invocations of a target smart contract';
  static examples = [
    `# Query past invocations of 'Token' contract's 'balanceOf' method`,
    `$ clisc query Token -I abcdefg --method=balanceOf --value=0x23f3ab3`,
    `# Query past occurrences of 'Token' contract's 'Approval' event`,
    `$ clisc query Token -I abcdefg --event=Approval`,
  ];

  static flags = {
    ...ScipCommand.flags,
    help: flags.help({ char: 'h', description: `show query command help` }),
    method: shared.method,
    event: shared.event,
    value: shared.value,
    filter: shared.filter,
    startTime: shared.startTime,
    endTime: shared.endTime,
  };

  static args = [...ScipCommand.args];

  fromFlags() {
    if (this.contract === undefined) {
      throw new CLIError(`Contract has not been initialized. Fatal error!`);
    }

    if (!this.flags.method && !this.flags.event) {
      throw new CLIError(`You MUST provide 'method' (-m --method) or 'event' (-e --event) name!`);
    }
    // retrieve the function/event to query
    const generic: Method | Event = this.flags.method
      ? this.contract.methods[this.flags.method]
      : this.contract.events[this.flags.event as string];

    if (generic === undefined) {
      throw new CLIError(
        `${
          this.flags.method ? "Method name '" + this.flags.method : "Event named'" + this.flags.event
        }" not found in '${this.contract.descriptor.name}' contract. Available ${
          this.flags.method
            ? 'methods: [' + Object.keys(this.contract.methods)
            : 'events: [' + Object.keys(this.contract.events)
        }]`,
      );
    }
    return generic.query(
      this.flags.id,
      this.flags.method ? this.flags.method : (this.flags.event as string),
      this.flags.value !== undefined ? this.flags.value : [],
      this.flags.filter,
      this.flags.startTime,
      this.flags.endTime,
    );
  }

  async fromFile() {
    if (this.contract === undefined) {
      throw new CLIError(`Contract has not been initialized. Fatal error!`);
    }

    let request: ScipRequest;

    try {
      request = await this.parseRequest();
    } catch (err) {
      throw err;
    }

    if (!(request instanceof types.ScipQuery)) {
      throw new CLIError('Invalid SCIP Query request');
    } else {
      // retrieve the function/event to query
      const generic: Method | Event =
        request.params instanceof types.FunctionQuery
          ? this.contract.methods[request.params.functionIdentifier]
          : this.contract.events[(request.params as types.EventQuery).eventIdentifier];

      return generic.request(request);
    }
  }
}
