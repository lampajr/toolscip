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
import { Contract, Method } from '@toolscip/scdl-lib';
import { CLIError } from '@oclif/errors';
import BaseCommand from '../base';
import Config from '../config';
import shared from '../shared';

export default class Invoke extends BaseCommand {
  static description = `invoke a target smart contract's function/method starting from a smart contract's descriptor.`;
  static examples = [
    `# Suppose you want to invoke a method named 'balanceOf' of a contract named 'Token'`,
    `$ clisc invoke -j abcdef -c Token -m balaceOf -v 0x23ab34bd..`,
  ];

  static flags = {
    ...BaseCommand.flags,
    help: flags.help({ char: 'h', description: `show invoke command help` }),
    auth: shared.auth,
    jsonrpc: shared.jsonrpc,
    contract: shared.contract,
    method: shared.method,
    value: shared.value,
    callback: shared.callback,
    corrId: shared.corrId,
    doc: shared.doc,
    timeout: shared.timeout,
    signature: shared.signature,
    file: shared.file,
  };

  async run() {
    if (this.cliscConfig === undefined || this.descriptorsFolder === undefined) {
      throw new CLIError('Unable to load the clisc configuration file!');
    }

    const filename: string = this.flags.contract + '.json';
    const descriptor = await Config.getDescriptor(filename, this.descriptorsFolder);

    if (this.flags.method === undefined) {
      throw new CLIError(`The name of the method to invoke is mandatory. Use flag '--method' or '-m' to set it`);
    }

    try {
      // creates the contract object starting from the descriptor
      const contract: Contract = new Contract(descriptor, this.flags.auth);
      // retrieve the function/method to invoke
      const method: Method = contract.methods[this.flags.method];
      if (method === undefined) {
        throw new CLIError(
          `Method named '${this.flags.method}' not found in '${
            contract.descriptor.name
          }' contract\nThis contract has the following available methods: [${Object.keys(contract.methods)}]`,
        );
      }
      method
        .invoke(
          this.flags.jsonrpc,
          this.flags.method,
          this.flags.value !== undefined ? this.flags.value : [],
          this.flags.signature,
          this.flags.callback,
          this.flags.corrId,
          this.flags.doc,
          this.flags.timeout,
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
