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
import * as inquirer from 'inquirer';
import { exec } from 'child_process';
import BaseCommand from '../base';
import { Config } from '../utils';
import chalk = require('chalk');

export default class Init extends BaseCommand {
  static description = `initialize the 'clisci' configuration files, this command MUST be executed in the directory where the user wants to store the project.`;

  static flags = {
    ...BaseCommand.flags,
    help: flags.help({ char: 'h', description: `show init command help` }),
    server: flags.boolean({
      char: 's',
      description: "initialize a simple 'express.js' server for receive asynchronous responses",
      default: false,
    }),
  };

  async run() {
    // clear the console
    console.clear();
    // print a nice banner
    this.banner('CLISC', chalk.redBright);

    // ask questions
    try {
      const answers = await this.ask(this.flags.server);

      const clisciConfig = new Config(answers.owner, process.cwd(), answers.formats, answers.registry);
      const configDir: string = join(clisciConfig.dir, Config.configFolder);
      const descriptorsDir: string = join(configDir, Config.descriptorsFolder);

      this.createDirectory(configDir);
      for (const format of clisciConfig.formats) {
        this.createDirectory(join(descriptorsDir, format));
      }

      try {
        await fs.writeJSON(join(clisciConfig.dir, Config.configFile), clisciConfig, {
          spaces: '\t',
        });
        this.log(`Configuration file '${Config.configFile}' successfully created!`, 'info');
      } catch (err) {
        console.error(err);
      }

      if (this.flags.server) {
        // initialize the express.js server
        this.log('Initializing simple server..', 'info');
        const res = exec('npm init --yes && npm install --save express', (error, stdout, stderr) => {
          if (error) {
            throw new CLIError(`Ops something went wrong while executing 'npm init' - ${error.message}`);
          } else {
            // the *entire* stdout and stderr (buffered)
            this.log(`stdout: ${stdout}`, 'info');
            this.log(`stderr: ${stderr}`, 'info');
          }
        });

        res.on('exit', code => this.log('Code: ' + code, 'info'));
      }
    } catch (err) {
      throw new CLIError(err.message);
    }
  }

  /**
   * Prompts the initialization questions
   * TODO: check that folder is not empty
   * @param server tells whether retrieve information about server initialization
   */
  private async ask(server: boolean) {
    const checked = ['scdl'];

    return inquirer.prompt([
      {
        type: 'input',
        name: 'owner',
        message: `Who is the project's owner?`,
      },
      {
        type: 'checkbox',
        name: 'formats',
        message: 'Which formats do you want to use?',
        choices: Config.supportedFormats,
        default: checked,
      },
      {
        type: 'confirm',
        name: 'useRegistry',
        message: 'Do you want to associate a register with the project?',
        default: true,
      },
      {
        type: 'input',
        name: 'registry',
        message: "What is the registry's api endpoint?",
        default: 'https://scdlregistry.herokuapp.com/api/descriptors/content',
        when: answers => {
          return answers.useRegistry;
        },
      },
      {
        type: 'input',
        name: 'entry',
        message: 'What is the file entry point of your server?',
        default: 'index.js',
        when: server,
      },
    ]);
  }

  /**
   * Create a directory at given path
   * @param path where the directory should be created
   */
  private async createDirectory(path: string) {
    try {
      await fs.mkdirp(path);
      this.log(`Directory at '${path}' successfully created!`, 'info');
    } catch (err) {
      console.error(err);
    }
  }
}