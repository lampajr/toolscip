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

import { CLIError } from '@oclif/errors';
import * as fs from 'fs-extra';
import { join } from 'path';

/**
 * Configuration file
 */
export default class Config {
  static configFolder = '.clisc';
  static descriptorsFolder = 'descriptors';
  static configFile = 'clisc.json';

  /**
   * Loads the configuration file from the current directory
   * @param path string path where try to find the config file
   * @returns a promise containing the Config object
   * @throws CLIError if the file was not found
   */
  static async load(path?: string | undefined): Promise<Config> {
    const p: string = path === undefined ? join(process.cwd(), Config.configFile) : path;
    try {
      const value: any = await fs.readJSON(p);
      return new Config(value.owner, value.dir, value.limit, value.logger, value.registry, value.callbackUrl);
    } catch (err) {
      throw new CLIError(`Unable to find the config file at '${p}'`);
    }
  }

  /**
   * Loads the descriptor's file into a generic json object
   * @param filename name of the contract's file to load
   * @param path path to the specific format descriptors' config folder
   * @returns the descriptor object
   */
  static async getDescriptor(filename: string, path: string): Promise<any> {
    const completPath: string = join(path, filename);
    try {
      return await fs.readJSON(completPath);
    } catch (err) {
      // throw new CLIError(`Unable to find the specified contract at '${completPath}'`);
      throw new CLIError(`Unable to load the descriptor at ${completPath}`);
    }
  }

  /** Owner of the project */
  owner: string;
  /** Main directory, where config files are stored */
  dir: string;
  /** Default number of returned descriptor when queried */
  limit: number;
  /** Logger filename */
  logger: string;
  /** Online registry URL [optional] */
  registry?: string;
  /** Global callback URL */
  callbackUrl?: string;

  constructor(owner: string, dir: string, limit: number, logger: string, registry?: string, callbackUrl?: string) {
    this.owner = owner;
    this.dir = dir;
    this.limit = limit;
    this.logger = logger;
    this.registry = registry;
    this.callbackUrl = callbackUrl;
  }

  /**
   * Returns the path to the folder where all SCDL descriptors
   * are located.
   */
  descriptorsFolder(): string {
    return join(this.configFolder(), Config.descriptorsFolder);
  }

  /**
   * Returns the path to the configuration folder
   */
  configFolder(): string {
    return join(this.dir, Config.configFolder);
  }
}

/**
 * Print a list of strings into a box
 * @param list messages
 */
// export function box(list: string[], title: string) {
//   let max: number = list.map(x => x.length).reduce((prev, curr) => (curr >= prev ? curr : prev), -1);
//   max = max >= title.length ? max : title.length;
//   const margin: number = 2;
//   let tmp = max - title.length + margin;
//   log(chalk.bold.green('+' + '-'.repeat(max + margin * 2 + 2) + '+'));
//   log(chalk.bold.green('| ' + ' '.repeat(margin) + title.toLocaleUpperCase() + ' '.repeat(tmp) + ' |'));
//   log(chalk.bold.green('+' + '-'.repeat(max + margin * 2 + 2) + '+'));

//   list.forEach(msg => {
//     tmp = max - msg.length + margin;
//     write(msg, '| ' + ' '.repeat(margin - 2) + '* ', ' '.repeat(tmp) + ' |');
//   });
//   log(chalk.bold.green('+' + '-'.repeat(max + margin * 2 + 2) + '+'));
// }
