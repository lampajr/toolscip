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
import * as fs from 'fs-extra';
import { join } from 'path';
import * as inquirer from 'inquirer';
import { redBright } from 'chalk';
import { textSync } from 'figlet';
import { Config } from '../utils';

export default class Init extends Command {
  static description = `Command used to initialize the 'clisci' configuration files, this command MUST be executed in the directory where the user wants to store the project.`;

  static flags = {
    help: flags.help({ char: 'h' }),
    server: flags.boolean({
      char: 's',
      description: "Initialize a simple 'express.js' server for receive asynchronous responses",
    }),
  };

  async run() {
    const { flags } = this.parse(Init);

    // TODO: clear the console

    // print a nice banner
    console.log(redBright(textSync('clisci', { horizontalLayout: 'full' })));

    // ask questions
    this.ask()
      .then(answers => {
        const clisciConfig = new Config(answers.owner, process.cwd(), answers.formats, answers.registry);
        const configDir: string = join(clisciConfig.dir, Config.configFolder);
        const descriptorsDir: string = join(configDir, Config.descriptorsFolder);

        this.createDirectory(configDir);
        for (const format of clisciConfig.formats) {
          this.createDirectory(join(descriptorsDir, format));
        }

        fs.writeJSON(join(clisciConfig.dir, Config.configFile), clisciConfig, {
          spaces: '\t',
        })
          .then(_ => {
            console.log(`Configuration file '${Config.configFile}' successfully created!`);
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });

    if (flags.server) {
      // initialize the express.js server
    }
  }

  /**
   * Prompts the initialization questions
   * TODO: check that folder is not empty
   */
  private async ask() {
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
        message: 'Do you want to associate to an online registry?',
        default: true,
      },
      {
        type: 'input',
        name: 'registry',
        message: "What is the registry's URL?",
        default: 'https://scdlregistry.herokuapp.com',
        when: answers => {
          return answers.useRegistry;
        },
      },
    ]);
  }

  /**
   * Create a directory at given path
   * @param path where the directory should be created
   */
  private createDirectory(path: string) {
    fs.mkdirp(path)
      .then(_ => {
        console.log(`Directory at '${path}' successfully created!`);
      })
      .catch(err => {
        console.error(err);
      });
  }
}
