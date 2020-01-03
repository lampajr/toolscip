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
import Config from '../config';
import chalk = require('chalk');
import ora = require('ora');

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

      const cliscConfig = new Config(answers.owner, process.cwd(), answers.registry);

      this.log('');
      this.createDirectory(cliscConfig.configFolder());
      this.createDirectory(cliscConfig.descriptorsFolder());

      try {
        await fs.writeJSON(join(cliscConfig.dir, Config.configFile), cliscConfig, {
          spaces: '\t',
        });
        this.log(`Configuration file '${Config.configFile}' successfully created!`);
      } catch (err) {
        console.error(err);
      }

      if (this.flags.server) {
        // initialize the express.js server
        this.log('\nInitializing simple server..');
        let spinner = ora({
          text: 'Initializing npm',
        }).start();

        exec('npm init --yes', (error, _stdout, _stderr) => {
          if (error) {
            spinner.fail();
            throw new CLIError(`Ops something went wrong while executing 'npm init' - ${error.message}`);
          } else {
            // the *entire* stdout and stderr (buffered)
            // this.log(stdout);
            // if (stderr) {
            //   this.log(stderr);
            // }
            spinner.succeed('npm initialized');

            spinner = ora({
              text: 'Installing dependencies',
            }).start();

            // TODO: add 'npm install @toolscip/scip-lib'
            exec('npm install --save express body-parser', (error, _stdout, _stderr) => {
              if (error) {
                spinner.fail();
                throw new CLIError(
                  `Ops something went wrong while installing dependencies (express, body-parser and @toolscip/scip-lib) - ${error.message}`,
                );
              } else {
                // the *entire* stdout and stderr (buffered)
                // this.log(stdout);
                // if (stderr) {
                //   this.log(stderr);
                // }
                spinner.succeed('express, body-parser and @toolscip/scip-lib successfully installed');

                spinner = ora({
                  text: 'Generating simple entry point',
                }).start();

                fs.writeFile(answers.entry, mainFile)
                  .then(_ => {
                    spinner.succeed(`${answers.entry} file sussessfully generated`);
                  })
                  .catch(err => {
                    spinner.fail(`${answers.entry} initialization failed - ${err.message}`);
                    throw new CLIError(`${answers.entry} initialization failed - ${err.message}`);
                  });
              }
            });

            // depRes.on('exit', code => this.log('Code: ' + code));
          }
        });

        // initRes.on('exit', code => this.log('Code: ' + code));
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
    return inquirer.prompt([
      {
        type: 'input',
        name: 'owner',
        message: `Who is the project's owner?`,
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
      this.log(`Directory at '${path}' successfully created!`);
    } catch (err) {
      console.error(err);
    }
  }
}

const mainFile =
  'const express = require("express");\nconst bodyParser = require("body-parser");\nconst scip = require("@toolscip/scip-lib");\n\nconst PORT = 8080;\nconst \
  app = express();\n\napp.use(bodyParser.urlencoded({ extended: true }));\napp.use(bodyParser.json());\n\napp.post("/", (req, res) => {\n\ttry {\n\t\tconst \
  response = scip.parseResponse(req.body);\n\t\tif (response.method === "ReceiveCallback") {\n\t\t\t// TODO: implement your logic here\n\t\t}\n\t} catch (err) \
  {\n\t\tres.json(scip.error(req.body.id, err));\n\t}\n});\n\n// make the server listen to requests\napp.listen(PORT, () => {\n\tconsole.log(`Server running at \
  port ${PORT}`);\n});';
