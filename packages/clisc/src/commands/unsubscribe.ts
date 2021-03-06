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
import { types, ScipRequest } from '@toolscip/scip-lib';
import { Method, Event } from '@toolscip/scdl-lib';
import ScipCommand from '../scip';
import shared from '../shared';

export default class Unsubscribe extends ScipCommand {
  static description = `stop live monitoring of a smart contract's function or event by unsubscribing a previous subscription.`;
  static examples = [
    `# Unsubscribe a previous subscription to a 'Token' contract's 'balanceOf' method`,
    `$ clisc unsubscribe Token -I abcdefg --method=balanceOf`,
    `# Unsubscribe a previous subscription to a 'Token' contract's 'Approval' event`,
    `$ clisc unsubscribe Token -I abcdefg --event=Approval`,
  ];

  static flags = {
    ...ScipCommand.flags,
    help: flags.help({ char: 'h', description: `show unsubscribe command help` }),
    method: shared.method,
    event: shared.event,
    val: shared.value,
    corrId: shared.corrId,
  };

  static args = [...ScipCommand.args];

  async fromFlags() {
    if (this.contract === undefined) {
      throw new CLIError(`Contract has not been initialized. Fatal error!`);
    }

    if (!this.flags.method && !this.flags.event) {
      throw new CLIError(`You MUST provide 'method' (-m --method) or 'event' (-e --event) name!`);
    }
    // retrieve the function/event to subscribe
    const attribute: Method | Event = this.flags.method
      ? this.contract.methods[this.flags.method]
      : this.contract.events[this.flags.event as string];

    if (attribute === undefined) {
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
    return attribute.unsubscribe(
      this.flags.id,
      this.flags.method ? this.flags.method : (this.flags.event as string),
      this.flags.corrId,
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

    if (!(request instanceof types.ScipUnsubscription)) {
      throw new CLIError('Invalid SCIP Unsubscription request');
    } else {
      // retrieve the function/event to query
      const generic: Method | Event =
        request.params instanceof types.FunctionUnsubscription
          ? this.contract.methods[request.params.functionIdentifier]
          : this.contract.events[(request.params as types.EventUnsubscription).eventIdentifier];

      return generic.request(request);
    }
  }
}
