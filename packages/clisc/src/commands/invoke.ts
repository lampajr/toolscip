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
import { join } from 'path';
import { CLIError } from '@oclif/errors';
import Command from '../base';
import { Config, loadConfig, getDescriptor, write } from '../utils';
import shared from '../shared';

export default class Invoke extends Command {
  static description = `invoke a target smart contract's function/method starting from a smart contract's descriptor.`;

  static flags = {
    ...Command.flags,
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
    const { flags } = this.parse(Invoke);

    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, 'scdl');

    const filename: string = flags.contract + '.json';
    const descriptor = await getDescriptor(filename, descriptorsFolder);

    if (flags.method === undefined) {
      throw new CLIError(`The name of the method to invoke is mandatory. Use flag '--method' or '-m' to set it`);
    }

    try {
      // creates the contract object starting from the descriptor
      const contract: Contract = new Contract(descriptor, flags.auth);
      // retrieve the function/method to invoke
      const method: Method = contract.methods[flags.method];
      if (method === undefined) {
        throw new CLIError(
          `Method named '${flags.method}' not found in '${
            contract.descriptor.name
          }' contract\nThis contract has the following available methods: [${Object.keys(contract.methods)}]`,
        );
      }
      method
        .invoke(
          flags.jsonrpc,
          flags.method,
          flags.value !== undefined ? flags.value : [],
          flags.signature,
          flags.callback,
          flags.corrId,
          flags.doc,
          flags.timeout,
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
