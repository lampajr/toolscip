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
import BaseCommand from '../../base';

export default class ScdlList extends BaseCommand {
  static limit = 15; // if 'extended' is not set returns only 5 descriptors

  static description = `list saved SCDL smart contract's descriptors`;
  static aliases = ['scdl:list', 'scdl:ls', 'scdl:index', 'scdl:get'];
  static examples = [
    `# list a default number of saved descriptors`,
    '$ clisc scdl:list',
    `# list all saved descriptors`,
    '$ clisc scdl:list --extended',
    `# list a maximum of 5 descriptors`,
    '$ clisc scdl:list --max 5',
    '# list all descriptors that match the provided keyword',
    '$ clisc scdl:list Token',
  ];

  static flags = {
    ...BaseCommand.flags,
    help: flags.help({ char: 'h', description: `show scdl:list command help` }),
    extended: flags.boolean({
      char: 'e',
      description: 'display all saved descriptors',
      default: false,
    }),
    max: flags.integer({ char: 'm', description: `maximum number of descriptors to display` }),
  };

  static args = [{ name: 'keyword', description: 'keyword search' }];

  async run() {
    if (this.cliscConfig === undefined) {
      throw new CLIError('Unable to load the clisc configuration file!');
    }

    fs.readdir(this.cliscConfig.descriptorsFolder() as string)
      .then(files => {
        const limit: number = this.flags.max ? this.flags.max : this.cliscConfig?.limit;
        const ll = (this.flags.extended ? files : files.slice(0, limit)).filter(name =>
          name.includes(this.args.keyword ? this.args.keyword : ''),
        );
        this.log(ll);
      })
      .catch(err => {
        throw new CLIError('Unable to read the descriptors directory - ' + err.message);
      });
  }
}
