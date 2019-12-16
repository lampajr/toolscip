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

import * as fs from 'fs-extra';
import { join } from 'path';
import { CLIError } from '@oclif/errors';
import * as chalk from 'chalk';

/**
 * Configuration file
 */
export class Config {
  static configFolder = '.clisci';
  static descriptorsFolder = 'descriptors';
  static configFile = 'sciconfig.json';
  static supportedFormats = ['scdl'];

  /** Owner of the project */
  owner: string;
  /** Main directory, where config files are stored */
  dir: string;
  /** Supported smart Contracts descriptor's formats */
  formats: string[];
  /** Online registry URL [optional] */
  registry?: string;

  constructor(owner: string, dir: string, formats: string[], registry?: string) {
    this.owner = owner;
    this.dir = dir;
    this.formats = formats;
    if (registry) {
      this.registry = registry;
    }
  }
}

/**
 * Loads the configuration file from the current directory
 * @param path string path where try to find the config file
 * @returns a promise containing the Config object
 * @throws CLIError if the file was not found
 */
export async function loadConfig(path?: string | undefined): Promise<Config> {
  const p: string = path === undefined ? join(process.cwd(), Config.configFile) : path;
  try {
    const value: any = await fs.readJSON(p);
    return new Config(value.owner, value.dir, value.formats, value.registry);
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
export async function getDescriptor(filename: string, path: string): Promise<any> {
  const completPath: string = join(path, filename);
  try {
    return await fs.readJSON(completPath);
  } catch (err) {
    // throw new CLIError(`Unable to find the specified contract at '${completPath}'`);
    throw new CLIError(`During descriptor loading - ${err.message}`);
  }
}

const log = console.log;

/**
 * Write an information command line message, if message is not provided
 * the function prints a blank line.
 * @param msg [optional] message to print
 */
export function write(msg?: any, prefix: string = '> ', suffix: string = ' ') {
  log(msg ? chalk.green(prefix) + chalk.bold(msg) + chalk.green(suffix) : '\n');
}

/**
 * Print a list of strings into a box
 * @param list messages
 */
export function box(list: string[]) {
  const max: number = list.map(x => x.length).reduce((prev, curr) => (curr >= prev ? curr : prev), -1);
  const margin: number = 2;
  log(chalk.bold.green('+' + '-'.repeat(max + margin * 2 + 2) + '+'));
  list.forEach(msg => {
    const tmp = max - msg.length + margin;
    write(msg, '| ' + ' '.repeat(margin), ' '.repeat(tmp) + ' |');
  });
  log(chalk.bold.green('+' + '-'.repeat(max + margin * 2 + 2) + '+'));
}
