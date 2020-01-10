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
import { Method } from '@toolscip/scdl-lib';
import { AxiosResponse } from 'axios';
import ScipCommand from '../scip';
import shared from '../shared';

export default class Invoke extends ScipCommand {
  static description = `invoke a target smart contract's function/method starting from a smart contract's descriptor.`;
  static examples = [
    `# Invoke a method named 'balanceOf' of a contract named 'Token'`,
    `$ clisc invoke Token -I abcdef --method=balanceOf --value=0x23ab34bd..`,
  ];

  static flags = {
    ...ScipCommand.flags,
    help: flags.help({ char: 'h', description: `show invoke command help` }),
    method: shared.method,
    value: shared.value,
    callback: shared.callback,
    corrId: shared.corrId,
    doc: shared.doc,
    timeout: shared.timeout,
    signature: shared.signature,
  };

  static args = [...ScipCommand.args];

  fromFlags(): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>> {
    if (this.flags.method === undefined) {
      throw new CLIError(`The name of the method to invoke is mandatory. Use flag '--method' or '-m' to set it`);
    }

    if (this.contract === undefined) {
      throw new CLIError(`Contract has not been initialized. Fatal error!`);
    }

    // retrieve the function/method to invoke
    const method: Method = this.contract.methods[this.flags.method];
    if (method === undefined) {
      throw new CLIError(
        `Method named '${this.flags.method}' not found in '${
          this.contract.descriptor.name
        }' contract\nThis contract has the following available methods: [${Object.keys(this.contract.methods)}]`,
      );
    }
    return method.invoke(
      this.flags.id,
      this.flags.method,
      this.flags.value !== undefined ? this.flags.value : [],
      this.flags.signature,
      this.flags.callback,
      this.flags.corrId,
      this.flags.doc,
      this.flags.timeout,
    );
  }

  async fromFile(): Promise<AxiosResponse<types.ScipError | types.ScipSuccess>> {
    if (this.contract === undefined) {
      throw new CLIError(`Contract has not been initialized. Fatal error!`);
    }

    let request: ScipRequest;

    try {
      request = await this.parseRequest();
    } catch (err) {
      throw err;
    }

    if (!(request instanceof types.ScipSubscription)) {
      throw new CLIError('Invalid SCIP Invocation request');
    } else {
      // retrieve the function/event to query
      const method: Method = this.contract.methods[(request.params as types.Invocation).functionId];

      return method.request(request);
    }
  }
}
