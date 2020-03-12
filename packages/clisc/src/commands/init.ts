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
import chalk = require('chalk');
import ora = require('ora');
import BaseCommand from '../base';
import Config from '../config';
import ScdlList from './scdl/list';
import { spawn } from 'child_process';

export default class Init extends BaseCommand {
  static description = `initialize the 'clisc' configuration files, this command MUST be executed in the directory where the user wants to store the project.`;
  static examples = [
    `# Initialize the 'clisc' configuration files for the current project`,
    `$ clisc init`,
    `# Initialize the 'clisc' configuration files for the current project skipping all questions`,
    `$ clisc init --yes`,
    `# Initialize the 'clisc' configuration files for the current project with a simple express.js server for the asynchronous responses`,
    `$ clisc init --server`,
  ];

  static flags = {
    ...BaseCommand.flags,
    help: flags.help({ char: 'h', description: `show init command help` }),
    server: flags.boolean({
      char: 's',
      description: 'initialize a simple server for receiving asynchronous responses',
      default: false,
    }),
    yes: flags.boolean({
      char: 'y',
      description: 'skip questions, set all values with default ones.',
      default: false,
    }),
  };

  async run() {
    // clear the console
    console.clear();
    // print a nice banner
    this.banner('CLISC', chalk.red);

    // ask questions
    try {
      let answers: any;
      if (this.flags.yes) {
        answers = {
          owner: '',
          limit: ScdlList.limit,
          logger: 'logger.json',
          useRegistry: true,
          registry: 'https://scdlregistry.herokuapp.com/api/descriptors/content',
          setGlobalCallback: true,
          callbackUrl: 'http://172.16.238.19:3001',
          serverTechnology: 'jayson',
          entry: 'index.js',
        };
      } else {
        answers = await this.ask(this.flags.server);
      }

      const cliscConfig = new Config(
        answers.owner,
        process.cwd(),
        answers.limit,
        answers.logger,
        answers.registry,
        answers.callbackUrl,
      );

      this.log('');
      let spinner = ora({
        text: 'Configuring project...',
      }).start();

      try {
        await fs.writeJSON(join(cliscConfig.dir, Config.configFile), cliscConfig, {
          spaces: '\t',
        });

        spinner.succeed(`Configuration file generated at '${join(cliscConfig.dir, Config.configFile)}'!`);
        this.log(``);
      } catch (err) {
        spinner.fail('Configuration file generation failed: ' + err.message);
      }

      await this.createDirectory(cliscConfig.configFolder());
      await this.createDirectory(cliscConfig.descriptorsFolder());

      spinner = ora({
        text: 'Creating logger...',
      }).start();

      try {
        await fs.writeJSON(
          join(cliscConfig.dir, cliscConfig.logger),
          {},
          {
            spaces: '\t',
          },
        );
        spinner.succeed(`Logger file generated at '${join(cliscConfig.dir, cliscConfig.logger)}'!`);
      } catch (err) {
        spinner.fail('Logger file generation failed: ' + err.message);
      }

      if (this.flags.server) {
        // initialize the express.js server
        this.log('\nInitializing simple server..');
        let spinner = ora({
          text: 'Initializing npm..',
        }).start();

        exec('npm init --yes', (error, _stdout, _stderr) => {
          if (error) {
            spinner.fail(`Something went wrong while executing 'npm init': ${error.message}`);
          } else {
            spinner.succeed('Project initialized');

            if (answers.serverTechnology === 'express') {
              spinner = ora({
                text: 'Installing dependencies..',
              }).start();
              // TODO: add @toolscip/scip-lib
              exec('npm install --save express body-parser', (error, _stdout, _stderr) => {
                if (error) {
                  spinner.fail(
                    `Something went wrong while installing dependencies (express, body-parser and @toolscip/scip-lib): ${error.message}`,
                  );
                } else {
                  spinner.succeed('Express, body-parser and @toolscip/scip-lib successfully installed');

                  spinner = ora({
                    text: `Generating ${answers.entry}..`,
                  }).start();

                  fs.writeFile(answers.entry, expressFile)
                    .then(_ => {
                      spinner.succeed(`${answers.entry} file successfully generated`);
                    })
                    .catch(err => {
                      spinner.fail(`${answers.entry} initialization failed - ${err.message}`);
                    });
                }
              });
            } else if (answers.serverTechnology === 'jayson') {
              spinner = ora({
                text: 'Installing dependencies..',
              }).start();
              exec('npm install --save jayson @toolscip/scip-lib', (error, _stdout, _stderr) => {
                if (error) {
                  spinner.fail(
                    `Something went wrong while installing dependencies (jayson and @toolscip/scip-lib): ${error.message}`,
                  );
                } else {
                  spinner.succeed('jayson and @toolscip/scip-lib successfully installed');

                  spinner = ora({
                    text: `Generating ${answers.entry}..`,
                  }).start();

                  fs.writeFile(answers.entry, jaysonFile)
                    .then(_ => {
                      spinner.succeed(`${answers.entry} successfully generated`);
                      spawn('node', [answers.entry], {
                        stdio: 'ignore',
                        detached: true,
                      }).unref();
                    })
                    .catch(err => {
                      spinner.fail(`${answers.entry} initialization failed - ${err.message}`);
                    });
                }
              });
            } else {
              // generating empty file
              spinner = ora({
                text: `Generating ${answers.entry}..`,
              }).start();

              fs.writeFile(answers.entry, '')
                .then(_ => {
                  spinner.succeed(`${answers.entry} file successfully generated`);
                })
                .catch(err => {
                  spinner.fail(`${answers.entry} initialization failed - ${err.message}`);
                });
            }
          }
        });
      }
    } catch (err) {
      throw new CLIError(err.message);
    }
  }

  /**
   * Create a directory at given path
   * @param path where the directory should be created
   */
  private async createDirectory(path: string) {
    const spinner = ora({
      text: 'Creting directory...',
    }).start();

    try {
      await fs.mkdirp(path);
      spinner.succeed(`Directory created at '${path}'!`);
    } catch (err) {
      spinner.fail('Directory creation failed: ' + err.message);
    }
  }

  /**
   * Prompts the initialization questions
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
        type: 'number',
        name: 'limit',
        message: 'How many descriptors do you want to return, as default?',
        default: ScdlList.limit,
      },
      {
        type: 'input',
        name: 'logger',
        message: 'What is logger filename?',
        default: 'logger.json',
      },
      {
        type: 'confirm',
        name: 'setGlobalCallback',
        message: 'Do you want to define a global callback URL?',
        default: true,
      },
      {
        type: 'input',
        name: 'callbackUrl',
        message: 'What is the global callback URL?',
        default: 'http://case-study-backend:8080',
        when: answers => {
          return answers.setGlobalCallback;
        },
      },
      {
        type: 'input',
        name: 'entry',
        message: 'What is the entry point of your server?',
        default: 'index.js',
        when: server,
      },
      {
        type: 'list',
        name: 'serverTechnology',
        message: 'Which kind of server do you want to use?',
        choices: ['express', 'jayson', 'empty'],
        when: server,
      },
    ]);
  }
}

const expressFile =
  'const express = require("express");\nconst bodyParser = require("body-parser");\nconst scip = require("@toolscip/scip-lib");\n\nconst PORT = 8080;\nconst \
  app = express();\n\napp.use(bodyParser.urlencoded({ extended: true }));\napp.use(bodyParser.json());\n\napp.post("/", (req, res) => {\n\ttry {\n\t\tconst \
  response = scip.parseResponse(req.body);\n\t\tif (response.method === "ReceiveCallback") {\n\t\t\t// TODO: implement your logic here\n\t\t}\n\t} catch (err) \
  {\n\t\tres.json(scip.error(req.body.id, err));\n\t}\n});\n\n// make the server listen to requests\napp.listen(PORT, () => {\n\tconsole.log(`Server running at \
  port ${PORT}`);\n});';

const jaysonFile =
  '"use strict";\nconst jayson = require("jayson");\nconst port = process.env.PORT || 3001;\n// create a server\nconst server = jayson.server({ \
\n\tReceiveResponse: function(args, callback) {\n\t\tconsole.log(JSON.stringify(args, null, 2));\n\t\tcallback(null, "Response received");\n\t  } \
\n});\nconsole.log(`Client server listening on port: ${port}`);\nserver.http().listen(port);';
