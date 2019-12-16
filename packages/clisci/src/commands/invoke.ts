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
import { Contract, Method } from '@lampajr/scdl-lib';
import { Config, loadConfig, getDescriptor, write } from '../utils';
import { join } from 'path';
import { CLIError } from '@oclif/errors';

export default class Invoke extends Command {
  static description = `Command used to invoke a target smart contract's function starting from a smart contract's descriptor.`;

  static flags = {
    help: flags.help({ char: 'h', description: `show invoke command help` }),
    path: flags.string({
      char: 'p',
      description: 'provide a path where the config files are located, if not set, the current dir is used',
    }),
    format: flags.string({ char: 'F', description: 'descriptor format', default: 'scdl' }),
    auth: flags.string({ char: 'a', description: 'authorization token' }),
    jsonrpc: flags.string({ char: 'j', description: 'jsonrpc request identifier', required: true }),
    contract: flags.string({ char: 'c', description: `contract's name`, required: true }),
    name: flags.string({ char: 'n', description: `name of the function to invoke`, required: true }),
    val: flags.string({
      char: 'v',
      description:
        'value to be passed as parameter to the function, if more than one value is required you can set this flag multiple times',
      multiple: true,
    }),
    signature: flags.string({
      char: 's',
      description: `cryptographic hash function's name that has to be used to sign the request`,
      default: 'sha256',
    }),
    callback: flags.string({
      char: 'u',
      description: 'callback URL to which the gateway will forward all asynchronous responses',
    }),
    corrId: flags.string({ char: 'i', description: 'client-provided correlation identifier' }),
    doc: flags.integer({ char: 'd', description: 'degree of confidence' }),
    timeout: flags.integer({
      char: 't',
      description: 'timeout that the gateway have to wait before block the operation',
    }),
  };

  async run() {
    const { flags } = this.parse(Invoke);

    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, flags.format);

    const filename: string = flags.contract + '.json';
    const descriptor = await getDescriptor(filename, descriptorsFolder);

    try {
      // creates the contract object starting from the descriptor
      const contract: Contract = new Contract(descriptor, flags.auth);
      // retrieve the function/method to invoke
      const method: Method = contract.methods[flags.name];
      if (method === undefined) {
        throw new CLIError(
          `Method named '${flags.name}' not found in '${
            contract.descriptor.name
          }' contract\nThis contract has the following available methods: [${Object.keys(contract.methods)}]`,
        );
      }
      method
        .invoke(
          flags.jsonrpc,
          flags.name,
          flags.val !== undefined ? flags.val : [],
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
