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
import { Config, loadConfig, write } from '../utils';
import { CLIError } from '@oclif/errors';
import * as fs from 'fs-extra';
import { join } from 'path';

export default class Scdl extends Command {
  static folderName = 'scdl';
  static description =
    'Command used to gain information about local descriptors, to add new descriptors and to delete already stored descriptors.';

  static flags = {
    help: flags.help({ char: 'h', description: `show scdl command help`, exclusive: ['delete', 'add', 'list'] }),
    list: flags.boolean({ char: 'l', description: 'list all scdl descriptors', exclusive: ['delete', 'add', 'help'] }),
    pattern: flags.string({
      char: 'P',
      description: 'set a pattern matching for descriptors to list',
      dependsOn: ['list'],
      exclusive: ['delete', 'add', 'help'],
    }),
    add: flags.string({ char: 'a', description: 'add a new descriptor', exclusive: ['delete', 'list', 'help'] }),
    local: flags.boolean({
      char: 'L',
      description: 'add a new descriptor from a local file path',
      dependsOn: ['add'],
      exclusive: ['remote'],
    }),
    remote: flags.boolean({
      char: 'R',
      description: 'add a new descriptor from a remote online registry',
      dependsOn: ['add'],
      exclusive: ['local'],
    }),
    delete: flags.string({ char: 'd', description: 'delete a local descriptor', exclusive: ['add', 'list', 'help'] }),
    path: flags.string({
      char: 'p',
      description: 'provide a path where the config files are located, if not set, the current dir is used',
    }),
  };

  async run() {
    const { flags } = this.parse(Scdl);

    // loads configuration file
    const config: Config = await loadConfig(flags.path);
    const descriptorsFolder = join(config.dir, Config.configFolder, Config.descriptorsFolder, Scdl.folderName);

    if (flags.list) {
      // list descriptors, TODO: handle patterns
      fs.readdir(descriptorsFolder)
        .then(files => {
          write(files);
        })
        .catch(err => {
          console.error(err);
        });
    } else if (flags.add) {
      // add a new descriptor
      if (!flags.local && !flags.remote) {
        throw new CLIError(`You MUST set one of the following flags 'remote' or 'local'!`);
      }

      if (flags.local) {
        // save a new descriptor from a local path
        const filename: string = flags.add.substring(flags.add.lastIndexOf('/') + 1);
        fs.copyFile(join(config.dir, flags.add), join(descriptorsFolder, filename))
          .then(val => {
            write(`Descriptor successfully saved at ${val}`);
          })
          .catch(err => {
            console.error(err.message);
          });
      } else {
        // download the descriptor from a remote registry
      }
    } else if (flags.delete) {
      fs.remove(join(descriptorsFolder, flags.delete))
        .then(_ => {
          write(`Descriptor successfully saved at ${descriptorsFolder}`);
        })
        .catch(err => {
          console.error(err.message);
        });
    }
  }
}
