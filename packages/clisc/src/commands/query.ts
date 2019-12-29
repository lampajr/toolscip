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
import scip, { types, ScipRequest } from '@toolscip/scip-lib';
import ScipCommand from '../scip';
import shared from '../shared';
import { AxiosResponse } from 'axios';
import * as fs from 'fs-extra';
import { ScipQuery } from 'scip-lib/dist/types';

export default class Query extends ScipCommand {
  static description = 'query past event occurences or function invocations';

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
      throw new CLIError(`You MUST provide 'function' or 'event' name!`);
    }
    // retrieve the function/event to subscribe
    const generic: Method | Event = this.flags.method
      ? this.contract.methods[this.flags.method]
      : this.contract.events[this.flags.event as string];

    if (generic === undefined) {
      throw new CLIError(
        `${
          this.flags.method ? "Method name '" + this.flags.method : "Event named'" + this.flags.event
        }" not found in '${this.contract.descriptor.name}' contract\nThis contract has the following available ${
          this.flags.method
            ? 'methods: [' + Object.keys(this.contract.methods)
            : 'events: [' + Object.keys(this.contract.events)
        }]`,
      );
    }
    return generic.query(
      this.flags.jsonrpc,
      this.flags.method ? this.flags.method : (this.flags.event as string),
      this.flags.value !== undefined ? this.flags.value : [],
      this.flags.filter,
      this.flags.startTime,
      this.flags.endTime,
    );
  }

  async fromFile(): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>> {
    let data: any = null;
    let request: ScipQuery;

    if (this.contract === undefined) {
      throw new CLIError(`Contract has not been initialized. Fatal error!`);
    }

    try {
      data = await fs.readJSON(this.flags.file);
    } catch (err) {
      throw new CLIError(`Unable to find a file at '${this.flags.file}'`);
    }

    try {
      request = scip.parseRequest(data);
    } catch (err) {
      throw new CLIError(`Malformed request - ${err.data}`);
    }

    if (!(request instanceof types.ScipQuery)) {
      throw new CLIError('Invalid SCIP Query request');
    } else {
      // retrieve the function/event to subscribe
      const params = request.params;
    }
  }
}
