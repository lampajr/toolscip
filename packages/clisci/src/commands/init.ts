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
import { CLIError } from '@oclif/errors';
import * as fs from 'fs-extra';
import { join } from 'path';
import * as inquirer from 'inquirer';
import { redBright } from 'chalk';
import { textSync } from 'figlet';
import { exec } from 'child_process';
import { Config, write } from '../utils';

export default class Init extends Command {
  static description = `initialize the 'clisci' configuration files, this command MUST be executed in the directory where the user wants to store the project.`;

  static flags = {
    help: flags.help({ char: 'h', description: `show init command help` }),
    server: flags.boolean({
      char: 's',
      description: "initialize a simple 'express.js' server for receive asynchronous responses",
    }),
  };

  async run() {
    const { flags } = this.parse(Init);

    // clear the console
    console.clear();
    // print a nice banner
    write(redBright(textSync('clisci', { horizontalLayout: 'full' })), '');

    // ask questions
    try {
      const answers = await this.ask(flags.server ? true : false);

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
        write(`Configuration file '${Config.configFile}' successfully created!`);
      } catch (err) {
        console.error(err);
      }

      if (flags.server) {
        // initialize the express.js server
        write('Initializing simple server..');
        const res = exec('npm init --yes && npm install --save express', (error, stdout, stderr) => {
          if (error) {
            throw new CLIError(`Ops something went wrong while executing 'npm init' - ${error.message}`);
          } else {
            // the *entire* stdout and stderr (buffered)
            write(`stdout: ${stdout}`);
            write(`stderr: ${stderr}`);
          }
        });

        res.on('exit', code => write('Code: ' + code));
      }
    } catch (err) {
      console.error(err);
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
      write(`Directory at '${path}' successfully created!`);
    } catch (err) {
      console.error(err);
    }
  }
}
