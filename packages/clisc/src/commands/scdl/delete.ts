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
import * as fs from 'fs-extra';
import { join } from 'path';
import BaseCommand from '../../base';

export default class ScdlDelete extends BaseCommand {
  static description = `delete a specific descriptor from the local directory`;
  static aliases = ['scdl:delete', 'scdl:remove', 'scdl:del', 'scdl:rm'];
  static examples = [`# delete a descriptor file named 'ZilliqaToken.json'`, '$ clisc scdl:delete ZilliqaToken.json'];

  static flags = {
    ...BaseCommand.flags,
    help: flags.help({ char: 'h', description: `show scdl:list command help` }),
  };

  static args = [{ name: 'name', required: true, description: `name of the contract's descriptor to delete` }];

  async run() {
    if (this.cliscConfig === undefined) {
      throw new CLIError('Unable to load the clisc configuration file!');
    }

    fs.remove(join(this.cliscConfig.descriptorsFolder() as string, this.args.name))
      .then(_ => {
        this.log(`Descriptor successfully removed at ${this.cliscConfig?.descriptorsFolder()}`);
      })
      .catch(err => {
        throw new CLIError(`Error occurred during scdl deletion - ${err.message}`);
      });
  }
}
