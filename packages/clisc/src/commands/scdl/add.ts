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
import { ISCDL } from '@toolscip/scdl-lib';
import { CLIError } from '@oclif/errors';
import * as fs from 'fs-extra';
import { join } from 'path';
import axios from 'axios';
import BaseCommand from '../../base';

export default class ScdlAdd extends BaseCommand {
  static description = 'add a new SCDL descriptor in the local directory.';
  static aliases = ['scdl:add', 'scdl:load'];
  static examples = [
    '# add a new descriptor from a local file',
    '$ clisc scdl:add MyToken.json --local',
    '# download a descriptor from an online registry',
    '$ clisc scdl:add 5dfcdad2fd321d00179ede01 --remote',
  ];

  static flags = {
    ...BaseCommand.flags,
    help: flags.help({ char: 'h', description: `show scdl:add command help` }),
    local: flags.boolean({
      char: 'l',
      description: 'add a new descriptor from a local file path',
      exclusive: ['remote'],
      default: false,
    }),
    remote: flags.boolean({
      char: 'r',
      description: 'add a new descriptor from a remote online registry',
      exclusive: ['local'],
      default: false,
    }),
  };

  static args = [
    {
      name: 'contract',
      required: true,
      description: 'path to a local SCDL file or a unique identifier inside the online registry',
    },
  ];

  async run() {
    if (this.cliscConfig === undefined) {
      throw new CLIError('Unable to load the clisc configuration file!');
    }

    if (!this.flags.local && !this.flags.remote) {
      throw new CLIError(`You MUST set one of the following flags 'remote' or 'local'!`);
    }

    if (this.flags.local) {
      // save a new descriptor from a local path
      const filename: string = this.args.contract.substring(this.args.contract.lastIndexOf('/') + 1);
      fs.copyFile(join(process.cwd(), this.args.contract), join(this.cliscConfig.descriptorsFolder(), filename))
        .then(_val => {
          this.log(`Descriptor successfully saved at ${this.cliscConfig?.descriptorsFolder()}`);
        })
        .catch(err => {
          throw new CLIError('Unable to copy the descriptor - ' + err.message);
        });
    } else {
      // download the descriptor from a remote registry
      if (this.cliscConfig.registry) {
        const endpoint: string = `${this.cliscConfig.registry}/${this.args.contract}`;
        try {
          const descriptor: ISCDL = (await axios.get(endpoint)).data;
          this.log(`${descriptor.name} contract's descriptor downloaded`);
          fs.writeJSON(join(this.cliscConfig.descriptorsFolder(), descriptor.name + '.json'), descriptor, {
            spaces: '\t',
          })
            .then(_ => {
              this.log(`Descriptor successfully saved at ${this.cliscConfig?.descriptorsFolder()}`);
            })
            .catch(err => {
              throw new CLIError(`Saving operation exited with the following error - ${err.message}`);
            });
        } catch (err) {
          throw new CLIError(`The online registry request failed with the following error - ${err.message}`);
        }
      } else {
        throw new CLIError("Missing online registry's url");
      }
    }
  }
}
